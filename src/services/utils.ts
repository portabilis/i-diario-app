import { Injectable } from '@angular/core';
import { ConnectionService } from './connection';
import { SafariViewController } from '@ionic-native/safari-view-controller';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { File } from '@ionic-native/file';
import { MessagesService } from './messages';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class UtilsService {
  constructor(
    private _connectionService: ConnectionService,
    private safariViewController: SafariViewController,
    private iab: InAppBrowser,
    private file: File,
    private messages: MessagesService,
    private viewSubject: Subject<any>,
  ){}

  public leaveView(isLeaving: boolean): Subject<boolean> {
    this.viewSubject.next(isLeaving);
    return this.viewSubject;
  }

  public viewIsLeaving() {
    return this.viewSubject;
  }

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

    this.messages.showToast('Não foi possível completar a atualização.' + offlineMessage);
  }

  public convertTextToHtml(text) {
    if (!text) return '';
    return text.replace(new RegExp('\n', 'g'), "<br />");
  }

  public forceCapitalize(text) {
    return text.toLowerCase().replace(/\b(\w)/g, s => s.toUpperCase());
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
  public getDate(date?: string | number | Date): Date {
    if (date)
      return new Date(date);
    else
      return new Date();
  }

  public getCurrentDate(): Date {
    return this.getDate();
  }

  public dateToTimezone(date: Date): Date {
    const currentTimezone = (this.getCurrentDate().getTimezoneOffset()) / 60;
    return new Date(new Date(date).setUTCHours(currentTimezone));
  }

  public hasAvailableStorage() {
    return new Promise((resolve) => resolve(true) )

    //Devido a incompatibilidade com androids antigos, foi comentado esse bloco de codigo.
    return this.file.getFreeDiskSpace().then(
      (success) => {
        return true;
      },
      (error) => {
        return false;
      }
    );
  }
}
