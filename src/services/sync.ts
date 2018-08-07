import { AlertController } from '../../node_modules/ionic-angular';
import { ConnectionService } from './connection';
import { Observable } from '../../node_modules/rxjs';
import { Injectable, EventEmitter } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable } from '../../node_modules/rxjs';

@Injectable()
export class SyncProvider {
  private isSyncingStatus: Boolean;
  public tooltipEvent: EventEmitter<any> = new EventEmitter;

  constructor(
    private connectionService: ConnectionService,
    private alert: AlertController,
    private storage: Storage,
  ) {
    this.isSyncingStatus = false;
    this.verifySyncDate();
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
  getLastSyncDate(): Promise<Date> {
    return this.storage.get('lastSyncDate').then(lastSyncDate => {
      return lastSyncDate;
    }).catch(error => {
      return new Date();
    });
  }

  isSyncDelayed() {
    return this.getLastSyncDate().then(lastSyncDate => {
      let difference = new Date().getTime() - lastSyncDate.getTime();
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
    let syncDate: Date = new Date();
    this.storage.set('lastSyncDate', syncDate);
  }

}
