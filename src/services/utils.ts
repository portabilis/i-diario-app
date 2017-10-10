import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { ConnectionService } from './connection';

@Injectable()
export class UtilsService {
  constructor(
    private _connectionService: ConnectionService,
    private _toastCtrl: ToastController
  ){}

  public toStringWithoutTime(date: Date){
    return date.getFullYear() +
        '-' + this.pad(date.getMonth() + 1) +
        '-' + this.pad(date.getDate());
  }

  public compareStrings(string1: String, string2: String){
    return string1.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, "").toUpperCase() == string2.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, "").toUpperCase();
  }

  private pad(number) {
    if (number < 10) {
      return '0' + number;
    }
    return number;
  }

  public toExtensiveFormat(date: Date) {
    var options = {
      month: "short", day: "numeric"
    };
    return date.toLocaleDateString('pt-BR', options);
  }

  public toBrazilianFormat(date: Date) {
    var options = {
      year: "numeric", month: "numeric", day: "numeric"
    };
    return date.toLocaleDateString('pt-BR', options);
  }

  public showRefreshPageError() {
    let offlineMessage = "";

    if(!this._connectionService.isOnline){
      offlineMessage = " Parece que você está offline";
    }

    let toast = this._toastCtrl.create({
      message: 'Não foi possível completar a atualização.' + offlineMessage,
      duration: 3000,
      position: 'middle'
    });

    toast.present();
  }

  public showGenericToast(message) {
    let toast = this._toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'middle'
    });

    toast.present();
  }
}