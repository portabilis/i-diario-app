import { Injectable } from '@angular/core';
import { AlertController } from '../../node_modules/ionic-angular';
import { ConnectionService } from './connection';
import { Observable } from '../../node_modules/rxjs';

@Injectable()
export class SyncProvider {
  private isSyncingStatus: Boolean;

  constructor(
    private connectionService: ConnectionService,
    private alert: AlertController,
  ) {
    this.isSyncingStatus = false;
  }

  start() {
    this.isSyncingStatus = true;
  }

  cancel() {
    this.isSyncingStatus = false;
  }

  complete() {
    this.isSyncingStatus = false;
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
}
