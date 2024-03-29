import { UserIndexPage } from './../pages/user-index/user-index';
import { ContentRecordsIndexPage } from './../pages/content-records-index/content-records-index';
import { SyncProvider } from './../services/sync';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable'
import { DailyFrequencyStudentsSynchronizer } from './../services/offline_data_synchronization/daily_frequency_students_synchronizer';
import { DailyFrequenciesSynchronizer } from './../services/offline_data_synchronization/daily_frequencies_synchronizer';
import { ContentRecordsSynchronizer } from './../services/offline_data_synchronization/content_records_synchronizer';
import { AuthService } from './../services/auth';
import { Component } from '@angular/core';
import { Platform, App, LoadingController, Loading, Alert } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';
import { SignIn } from '../pages/sign-in/sign-in';
import { ConnectionService } from './../services/connection';
import { AppIndexPage } from "../pages/app-index/app-index";
import { UtilsService } from './../services/utils';
import { NpsService } from './../services/nps';
import { MessagesService } from './../services/messages';
import { LessonPlanIndexPage } from '../pages/lesson-plan-index/lesson-plan-index';
import { TeachingPlanIndexPage } from '../pages/teaching-plan-index/teaching-plan-index';
import { FrequencyIndexPage } from '../pages/frequency-index/frequency-index';
import { User } from '../data/user.interface';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = SignIn;
  private loadingSync: Loading;
  private networkStatus: string;
  private syncAlert: Alert;

  constructor(app: App,
              platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              network: Network,
              private connectionService: ConnectionService,
              private auth: AuthService,
              private dailyFrequenciesSynchronizer: DailyFrequenciesSynchronizer,
              private dailyFrequencyStudentsSynchronizer: DailyFrequencyStudentsSynchronizer,
              private contentRecordsSynchronizer: ContentRecordsSynchronizer,
              private loadingCtrl: LoadingController,
              private storage: Storage,
              private messages: MessagesService,
              private sync: SyncProvider,
              private utilsService: UtilsService,
              private npsService: NpsService
            ) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      statusBar.overlaysWebView(false);
      statusBar.backgroundColorByHexString('#4a0079');
      statusBar.styleBlackOpaque();
      splashScreen.hide();
      network.onConnect().subscribe(() => {
        if (this.networkStatus === 'offline') {
          this.networkStatus = 'online';
          setTimeout(() => {
            this.connectionService.setStatus(true);
            this.syncOfflineData();
          }, 5000);
        }
      });
      network.onDisconnect().subscribe(() => {
        this.connectionService.setStatus(false);
        this.networkStatus = 'offline';
      });

      this.auth.currentUser().then((result) => {
        if(result){
          npsService.startNps(<User> result);
          this.rootPage = AppIndexPage
        }
      })

      platform.registerBackButtonAction(() => {
        let nav = app.getActiveNavs()[0];
        let activeComponent = nav.getActive().component;
        let tabViews = [
          ContentRecordsIndexPage,
          LessonPlanIndexPage,
          TeachingPlanIndexPage,
          UserIndexPage
        ];
        let backDefaultTab = false;

        for (let i = 0; i < tabViews.length; i++) {
          if (tabViews[i] === activeComponent) {
            backDefaultTab = true;
          }
        }

        if (backDefaultTab) {
          nav.parent.select(0);
        } else if (activeComponent === FrequencyIndexPage) {
          if (this.sync.isSyncing()) {
            this.messages.showError("A sincronização ainda não foi concluída. Deseja sair mesmo assim?", "Sincronização em andamento", [{
              text: 'Parar sincronização e sair',
              handler: () => {
                platform.exitApp();
              }
            }, {
              text: 'Continuar sincronização',
              handler: () => {}
            }]);
          } else {
            platform.exitApp();
          }
        } else if (activeComponent === SignIn) {
          platform.exitApp();
        } else {
          if (nav.canGoBack()) {
            nav.pop();
          }
        }

      });

    });
  }

  private showIsSynchronizingAlert() {
    this.loadingSync = this.loadingCtrl.create({
      content: "As frequências e os conteúdos de aula lançados estão sendo sincronizados, aguarde por favor."
    });
    this.loadingSync.present();
  }

  private hideIsSynchronizingAlert() {
    if (this.loadingSync)
      this.loadingSync.dismiss();
  }

  private showIsSychronizedAlert() {
    this.hideIsSynchronizingAlert();
    this.syncAlert = this.messages.showAlert(
      'As frequências e os conteúdos de aula lançados foram sincronizadas com sucesso.',
      'Fim da sincronização'
    );  
  }

  private hideSyncronizationAlerts() {
    if (this.syncAlert)
      this.syncAlert.dismiss();
  }

  private showIsSychronizedToast() {
    this.loadingSync.dismiss();
    this.messages.showError('As frequências lançadas foram sincronizadas com sucesso.','Sucesso',
    [
      {
        text: 'OK',
        handler: () => {}
      }
    ]);
  }

  private showSynchronizationErrorToast() {
    this.loadingSync.dismiss();
    this.messages.showError('Não foi possível sincronizar as frequências lançadas.', 'Erro',
    [
      {
        text: 'OK',
        handler: () => {}
      }
    ]);
  }

  private syncOfflineData(){
    this.hideSyncronizationAlerts();
    this.sync.verifyWifi().subscribe(() => {
      this.storage.get('dailyFrequenciesToSync').then((dailyFrequenciesToSync) => {
        this.storage.get('dailyFrequencyStudentsToSync').then((dailyFrequencyStudentsToSync) => {
          this.showIsSynchronizingAlert();
          if (!dailyFrequenciesToSync && !dailyFrequencyStudentsToSync.length) {
            this.syncOfflineContentRecordsData(false);
            return;
          }
          this.dailyFrequenciesSynchronizer.sync(dailyFrequenciesToSync).subscribe(
            () => {
            },
            (error) => {
              this.showSynchronizationErrorToast();
            },
            () => {
              this.storage.remove('dailyFrequenciesToSync')
              this.dailyFrequencyStudentsSynchronizer.sync(dailyFrequencyStudentsToSync).subscribe(
                () => {
                },
                (error) => {
                  this.showSynchronizationErrorToast();
                },
                () => {
                  this.syncOfflineContentRecordsData(true);
                }
              )
            }
          )
        })
      })
    })
  }

  private syncOfflineContentRecordsData(isFrequenciesSynced: boolean){
    Observable.forkJoin(
      this.auth.currentUser(),
      this.storage.get('contentRecordsToSync')
    ).subscribe((result) => {
      let user = result[0];
      let contentRecords = result[1];
      if(!contentRecords || !contentRecords.length ){
        if (!isFrequenciesSynced)
          this.hideIsSynchronizingAlert();
        else
          this.showIsSychronizedAlert();
        return;
      }
      this.contentRecordsSynchronizer.sync(contentRecords, user['teacher_id']).subscribe(
        () => {
        },
        (error) => {
          this.showSynchronizationErrorToast();
        },
        () => {
          this.showIsSychronizedAlert();
        }
      );
    });
  }
}
