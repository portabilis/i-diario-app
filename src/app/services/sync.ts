import { Injectable, EventEmitter } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { Observable, from, interval, concat, forkJoin, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { ConnectionService } from './connection';
import { UtilsService } from './utils';
import { ContentRecordsSynchronizer } from './offline_data_synchronization/content_records_synchronizer';
import { DailyFrequencyStudentsSynchronizer } from './offline_data_synchronization/daily_frequency_students_synchronizer';
import { DailyFrequenciesSynchronizer } from './offline_data_synchronization/daily_frequencies_synchronizer';
import { ObservationDiaryRecordsSynchronizer } from './offline_data_synchronization/observation_diary_records_synchronizer';
import { OfflineDataPersisterService } from './offline_data_persistence/offline_data_persister';
import { MessagesService } from './messages';
import { StorageService } from './storage.service';
import { DailyNoteRecordsSynchronizer } from "./offline_data_synchronization/daily_notes_record_synchronizer";

@Injectable()
export class SyncProvider {
  private isSyncingStatus = false;
  private loadingSync!: HTMLIonLoadingElement;
  public tooltipEvent: EventEmitter<any> = new EventEmitter();

  constructor(
    private alert: AlertController,
    private connectionService: ConnectionService,
    private loadingCtrl: LoadingController,
    private messages: MessagesService,
    private storage: StorageService,
    private utilsService: UtilsService,
    private dailyFrequenciesSynchronizer: DailyFrequenciesSynchronizer,
    private dailyFrequencyStudentsSynchronizer: DailyFrequencyStudentsSynchronizer,
    private contentRecordsSynchronizer: ContentRecordsSynchronizer,
    private observationDiaryRecordsSynchronizer: ObservationDiaryRecordsSynchronizer,
    private dailyNoteRecordsSynchronizer: DailyNoteRecordsSynchronizer,
    private offlineDataPersister: OfflineDataPersisterService,
  ) {
    this.verifySyncDate();
  }

  private async showLoading() {
    this.loadingSync = await this.loadingCtrl.create({
      message: 'Estamos sincronizando os seus dados, aguarde por favor.',
    });
    await this.loadingSync.present();
  }

  private hideLoading() {
    if (this.loadingSync) {
      return this.loadingSync.dismiss();
    }

    return Promise.resolve();
  }

  async startSyncProcess() {
    this.isSyncingStatus = true;
    await this.showLoading();
  }

  async completeSync() {
    this.isSyncingStatus = false;
    await this.hideLoading();
    await this.messages.showAlert(
      'Sincronização concluída com sucesso.',
      'Fim da sincronização',
    );
  }

  async handleError(errorMessage?: string) {
    this.isSyncingStatus = false;
    await this.hideLoading();
    await this.messages.showError(
      errorMessage || 'Não foi possível concluir a sincronização.',
      'Erro',
    );
  }

  isSyncing() {
    return this.isSyncingStatus;
  }

  private verifyWifi(): Observable<boolean> {
    return new Observable((observer) => {
      if (
        this.connectionService.getNetworkType() !== 'wifi' &&
        this.connectionService.isOnline
      ) {
        this.alert
          .create({
            header: 'Rede móvel',
            message:
              '<p>Você está conectado em uma rede móvel. A sincronização pode ser mais lenta que em uma rede Wi-Fi e poderá consumir seu plano de dados.</p><p><strong>Você deseja continuar a sincronização mesmo assim?</strong></p>',
            buttons: [
              {
                text: 'Cancelar',
                role: 'cancel',
                handler: () => observer.next(false),
              },
              { text: 'Sincronizar', handler: () => observer.next(true) },
            ],
          })
          .then((alertEl) => {
            alertEl.present();
            alertEl.onDidDismiss().then(() => observer.complete());
          });
      } else {
        observer.next(true);
        observer.complete();
      }
    });
  }

  private async getLastSyncDate(): Promise<Date> {
    return this.storage
      .get('lastSyncDate')
      .then(
        (lastSyncDate) => lastSyncDate || this.utilsService.getCurrentDate(),
      );
  }

  public async isSyncDelayed() {
    return this.getLastSyncDate()
      .then((lastSyncDate) => {
        const daysDifference = Math.round(
          (this.utilsService.getCurrentDate().getTime() -
            lastSyncDate.getTime()) /
            (1000 * 60 * 60 * 24),
        );

        if (daysDifference >= 5) {
          this.callDelayedSyncAlert(daysDifference);
        }
      })
      .catch(() => this.callSyncTooltip());
  }

  private verifySyncDate() {
    const hourInMs = 1000 * 60 * 60;
    interval(hourInMs * 12)
      .pipe(switchMap(() => from(this.isSyncDelayed())))
      .subscribe();
  }

  private callSyncTooltip() {
    this.tooltipEvent.emit({
      seconds: 5,
      text: 'Clique neste ícone para sincronizar',
    });
  }

  private callDelayedSyncAlert(delayedDays: number) {
    this.alert
      .create({
        header: 'Sincronização',
        message: `Você está há ${delayedDays} dias sem sincronizar o aplicativo. Acesse uma rede de internet sem fio e clique no botão de sincronização para evitar perder seus dados.`,
        backdropDismiss: false,
        buttons: [{ text: 'OK' }],
      })
      .then((alertEl) => alertEl.present());
  }

  private setSyncDate() {
    const syncDate: Date = this.utilsService.getCurrentDate();
    this.storage.set('lastSyncDate', syncDate);
  }

  syncAll(): Observable<any> {
    return new Observable((observer) => {
      this.verifyWifi()
        .pipe(
          switchMap((continueSync) => {
            if (!continueSync) {
              observer.error('Sincronização cancelada.');
              return of(null);
            }

            return from(this.utilsService.hasAvailableStorage()).pipe(
              switchMap((available) => {
                if (!available) {
                  this.messages.showError(
                    this.messages.insuficientStorageErrorMessage(
                      'sincronizar frequências',
                    ),
                  );
                  return of(null);
                }

                if (!this.connectionService.isOnline) {
                  this.messages.showToast(
                    'Sem conexão! Verifique sua conexão com a internet e tente novamente.',
                  );
                  return of(null);
                }

                this.startSyncProcess();

                return forkJoin({
                  user: from(this.storage.get('user')),
                  dailyFrequenciesToSync: from(
                    this.storage.get('dailyFrequenciesToSync') || [],
                  ),
                  dailyFrequencyStudentsToSync: from(
                    this.storage.get('dailyFrequencyStudentsToSync') || [],
                  ),
                  contentRecordsToSync: from(
                    this.storage.get('contentRecordsToSync') || [],
                  ),
                  observationDiariesToSync: from(
                    this.storage.get('observationDiariesToSync') || [],
                  ),
                }).pipe(
                  switchMap((results) => {
                    if (!results) {
                      observer.error('Nenhum resultado retornado.');
                      return of(null);
                    }

                    const {
                      user,
                      dailyFrequenciesToSync,
                      dailyFrequencyStudentsToSync,
                      contentRecordsToSync,
                      observationDiariesToSync,
                    } = results;

                    // Tratamento seguro para sincronizações
                    const dailyFrequenciesObservable =
                      dailyFrequenciesToSync?.length
                        ? this.dailyFrequenciesSynchronizer.sync(
                            dailyFrequenciesToSync,
                          )
                        : of(null);

                    const dailyFrequencyStudentsObservable =
                      dailyFrequencyStudentsToSync?.length
                        ? this.dailyFrequencyStudentsSynchronizer.sync(
                            dailyFrequencyStudentsToSync,
                          )
                        : of(null);

                    const contentRecordsObservable =
                      contentRecordsToSync?.length
                        ? this.contentRecordsSynchronizer.sync(
                            contentRecordsToSync,
                            user?.['teacher_id'],
                          )
                        : of(null);

                    const observationDiariesObservable =
                      observationDiariesToSync?.length
                        ? this.observationDiaryRecordsSynchronizer.sync(
                            observationDiariesToSync,
                            user?.['teacher_id'],
                          )
                        : of(null);

                    // Garantimos que todos os observables sejam válidos para o concat
                    return concat(
                      dailyFrequenciesObservable,
                      dailyFrequencyStudentsObservable,
                      contentRecordsObservable,
                      observationDiariesObservable,
                    ).pipe(
                      switchMap(() =>
                        forkJoin([
                          this.storage.remove('dailyFrequencyStudentsToSync'),
                          this.storage.remove('dailyFrequenciesToSync'),
                        ]),
                      ),
                      catchError((error) => {
                        this.handleError(
                          'Erro durante o processo de sincronização.',
                        );
                        observer.error(error);
                        return of(null); // Continua o fluxo em caso de erro
                      }),
                    );
                  }),
                );
              }),
            );
          }),
        )
        .subscribe({
          next: () => {
            this.completeSync();
            this.setSyncDate();
            observer.next(); // Notifica o sucesso
            observer.complete(); // Conclui o observable
          },
          error: (error) => {
            console.log(error);
            this.handleError(error);
            observer.error(error); // Notifica o erro
          },
        });
    });
  }

  execute() {
    return from(this.startSyncProcess()).pipe(
      switchMap(() => forkJoin({ user: this.storage.get('user') })),

      // Passo 1
      // Mapear os dados ainda não sincronizados
      switchMap((payload) =>
        forkJoin({
          dailyFrequenciesToSync: from(
            this.storage.get('dailyFrequenciesToSync') || [],
          ),
          dailyFrequencyStudentsToSync: from(
            this.storage.get('dailyFrequencyStudentsToSync') || [],
          ),
          contentRecordsToSync: from(
            this.storage.get('contentRecordsToSync') || [],
          ),
          // Importante:
          // Nova abordagem: usamos o campo `synced` para determinar se deve ou não ser sincronizados
          observationDiariesToSync: from(
            this.storage.get('observationDiaries') || [],
          ),
          dailyNotesToSync: from(
            this.storage.get('dailyNotes') || [],
          ),
        }).pipe(map((result) => ({ ...payload, ...result }))),
      ),

      // Passo 2
      // Fazer a sincronização dos dados
      switchMap((payload) => {
        const {
          user,
          dailyFrequenciesToSync,
          dailyFrequencyStudentsToSync,
          contentRecordsToSync,
          observationDiariesToSync,
          dailyNotesToSync,
        } = payload;

        const dailyFrequenciesObservable = dailyFrequenciesToSync?.length
          ? this.dailyFrequenciesSynchronizer.sync(dailyFrequenciesToSync)
          : of(null);

        const dailyFrequencyStudentsObservable =
          dailyFrequencyStudentsToSync?.length
            ? this.dailyFrequencyStudentsSynchronizer.sync(
                dailyFrequencyStudentsToSync,
              )
            : of(null);

        const contentRecordsObservable = contentRecordsToSync?.length
          ? this.contentRecordsSynchronizer.sync(
              contentRecordsToSync,
              user?.['teacher_id'],
            )
          : of(null);

        // Importante:
        // Envia os dados apenas do que não está sincronizado
        const observationDiariesObservable = observationDiariesToSync?.length
          ? this.observationDiaryRecordsSynchronizer.sync(
              observationDiariesToSync.filter((s: any) => !s.synced),
              user?.['teacher_id'],
            )
          : of(null);

        const dailyNotesObservable = dailyNotesToSync?.length
          ? this.dailyNoteRecordsSynchronizer.sync(
              dailyNotesToSync.filter((s: any) => !s.synced),
              user?.['teacher_id'],
            )
          : of(null);

        return concat(
          dailyFrequenciesObservable,
          dailyFrequencyStudentsObservable,
          contentRecordsObservable,
          observationDiariesObservable,
          dailyNotesObservable,
        ).pipe(map((result) => ({ ...payload, ...result })));
      }),

      // Passo 3
      // Remover do storage o que já foi sincronizado
      switchMap((payload) =>
        forkJoin({
          dailyFrequencyStudentsToRemove: this.storage.remove(
            'dailyFrequencyStudentsToSync',
          ),
          dailyFrequenciesToRemove: this.storage.remove(
            'dailyFrequenciesToSync',
          ),
          contentRecordsToRemove: this.storage.remove(
            'contentRecordsToSync',
          ),
        }).pipe(map((result) => ({ ...payload, ...result }))),
      ),

      // Passo 4
      // Sincronizar os dados
      switchMap((payload) =>
        this.offlineDataPersister
          .persist(payload.user)
          .pipe(map((result) => ({ ...payload, ...result }))),
      ),

      // Passo 5
      // Encerrar o loading e definir a data da última sincronização
      tap(() => {
        this.completeSync().then(() => {});
        this.setSyncDate();
      }),

      // Passo 6
      // Valida se há ano letivo em aberto sem ser o ano atual
      tap(({ schoolCalendars }) => {
        const year = new Date().getFullYear();
        const years: number[] = [];

        schoolCalendars.forEach(
          (calendar: { data: { year: number }; unityId: number }) => {
            if (calendar.data.year < year) {
              years.push(calendar.data.year);
            }
          },
        );

        if (years.length === 0) {
          return;
        }

        this.messages.showAlert(
          'Existem escolas com o ano letivo em aberto para os anos de: ' +
            years.filter((x, i, a) => a.indexOf(x) == i).join(', '),
          'Ano letivo em aberto',
        );
      }),

      catchError((err) => {
        this.handleError(err.message).then(() => {});
        throw err;
      }),
    );
  }
}
