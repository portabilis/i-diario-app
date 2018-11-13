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

  cancel() {
    this.isSyncingStatus = false;
    this.loadingSync.dismiss();
  }

  complete() {
    this.isSyncingStatus = false;
    this.loadingSync.dismiss();
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
  getLastSyncDate(): Promise<Date> {
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

      if (difference/dayInMs >= 5 || !lastSyncDate)
        this.callSyncTooltip();
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
    this.tooltipEvent.emit(5);
  }

  setSyncDate() {
    let syncDate: Date = this.utilsService.getCurrentDate();
    this.storage.set('lastSyncDate', syncDate);
  }

}
