import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { ConnectionService } from './connection';
import { SafariViewController } from '@ionic-native/safari-view-controller';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { File } from '@ionic-native/file';

@Injectable()
export class UtilsService {
  constructor(
    private _connectionService: ConnectionService,
    private _toastCtrl: ToastController,
    private safariViewController: SafariViewController,
    private iab: InAppBrowser,
    private file: File,
  ){}

  public toStringWithoutTime(date: Date){
    return date.getFullYear() +
        '-' + this.pad(date.getMonth() + 1) +
        '-' + this.pad(date.getDate());
  }

  public compareStrings(string1: String, string2: String){
    return this.comparableString(string1) == this.comparableString(string2);
  }

  public comparableString(string: String){
    return string.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, "").toUpperCase();
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

  public convertTextToHtml(text) {
    if (!text) return '';
    return text.replace(new RegExp('\n', 'g'), "<br />");
  }

  public forceCapitalize(text) {
    return text.toLowerCase().replace(/\b(\w)/g, s => s.toUpperCase());
  }

  public showGenericToast(message) {
    let toast = this._toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'middle'
    });

    toast.present();
  }

  public openUrl(url) {
    this.safariViewController.isAvailable().then((available) => {
        if (available) {
          this.safariViewController.show({ url: url, }).subscribe(
            (result: any) => {

            },
            (error: any) => {

            }
          );
        } else {
          const browser = this.iab.create(url);
        }
      }
    );
  }

  public hasAvailableStorage() {
    this.file.getFreeDiskSpace().then(
      (success) => {
        return success > 50000;
      },
      (error) => {
        console.log(error);
        return false;
      }
    );
  }
}