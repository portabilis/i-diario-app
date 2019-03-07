import { MessagesService } from './messages';
import { Injectable, EventEmitter } from '@angular/core';
import { Storage } from '@ionic/storage';

import { AlertController, LoadingController, Loading } from '../../node_modules/ionic-angular';

import { Observable } from '../../node_modules/rxjs';

import { ConnectionService } from './connection';
import { UtilsService } from './utils';

@Injectable()
export class SyncProvider {
  private isSyncingStatus: Boolean;
  private loadingSync: Loading;
  public tooltipEvent: EventEmitter<any> = new EventEmitter;

  constructor(
    private alert: AlertController,
    private connectionService: ConnectionService,
    private loadingCtrl: LoadingController,
    private messages: MessagesService,
    private storage: Storage,
    private utilsService: UtilsService,
  ) {
    this.isSyncingStatus = false;
    this.verifySyncDate();
  }
  
  start() {
    this.isSyncingStatus = true;
    this.loadingSync = this.loadingCtrl.create({
      content: "Estamos sincronizando os seus dados, aguarde por favor."
    });
    this.loadingSync.present();
  }

  cancel(errorMessage?: string) {
    this.isSyncingStatus = false;
    this.loadingSync.dismiss();
    this.messages.showError(errorMessage || 'Não foi possível concluir a sincronização.');
  }

  complete() {
    this.isSyncingStatus = false;
    this.loadingSync.dismiss();
    this.messages.showAlert('Sincornização concluída com sucesso.', 'Fim da sincronização');
  }

  isSyncing() {
    return this.isSyncingStatus;
  }

  verifyWifi() {
    let continueSync = new Observable(observer => {
      if (this.connectionService.getNetworkType() !== 'wifi'  && this.connectionService.isOnline) {
        let alertWifi = this.alert.create({
          title: 'Rede móvel',
          message: '<p>Você está conectado em uma rede móvel. A sincronização pode ser mais lenta que em uma rede Wi-Fi e poderá consumir seu plano de dados.</p><p><strong>Você deseja continuar a sincronização mesmo assim?</strong></p>',
          buttons: [{
            text: 'Cancelar',
            cssClass: 'alert-button-light',
            handler: () => {
              alertWifi.dismiss(false);
              return false;
            }
          },{
              text: 'Sincronizar',
              cssClass: 'alert-button-primary',
              handler: () => {
                alertWifi.dismiss(true);
                return false;
              }
            }]
        });

        alertWifi.present();

        alertWifi.onDidDismiss((data) => {
          observer.next(data);
          observer.complete();
        });
      } else {
        observer.next(true);
        observer.complete();
      }
    });

    return continueSync;
  }
  getLastSyncDate(): Promise<any> {
    return this.storage.get('lastSyncDate').then(lastSyncDate => {
      return lastSyncDate;
    }).catch(error => {
      return this.utilsService.getCurrentDate();
    });
  }

  isSyncDelayed() {
    return this.getLastSyncDate().then(lastSyncDate => {
      let difference = this.utilsService.getCurrentDate().getTime() - lastSyncDate.getTime();
      let dayInMs = 1000*60*60*24;
      let daysDifference = Math.round(difference/dayInMs);

      if (daysDifference >= 5 || !lastSyncDate)
        this.callDelayedSyncAlert(daysDifference);
    }).catch(error => {
      this.callSyncTooltip();
    });
  }

  verifySyncDate() {
    let hourInMs = 1000*60*60;

    Observable.interval(hourInMs*12).subscribe(() => {
      this.isSyncDelayed();
    });
  }

  callSyncTooltip() {
    this.tooltipEvent.emit({
      seconds: 5,
      text: 'Clique neste ícone para sincronizar'
    });
  }

  callDelayedSyncAlert(delayedDays: number) {
    let syncAlert = this.alert.create({
      title: 'Sincronização',
      message: 'Você está há ' + delayedDays + ' dias sem sincronizar o aplicativo. Acesse uma rede de internet sem fio e clique no botão de sincronização para evitar perder seus dados.',
      enableBackdropDismiss: false,
      buttons: [{
        text: 'OK',
        handler: () => {}
       }],
    });
     syncAlert.present();
  };

  setSyncDate() {
    let syncDate: Date = this.utilsService.getCurrentDate();
    this.storage.set('lastSyncDate', syncDate);
  }

}
