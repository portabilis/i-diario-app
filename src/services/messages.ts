import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';

@Injectable()
export class MessagesService {
  constructor(
    private alertCtrl: AlertController,
  ){}

  public showError(message,
                   title='Erro',
                   buttons=[{
                     text: 'OK',
                     handler: () => {}
                   }]) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: buttons,
    });
    alert.present();
  }

  public insuficientStorageErrorMessage(action) {
    return `Espaço de armazenamento insuficiente no dispositivo para ${action}. São necessários, no mínimo, 50 MB livres para executar a operação.`;
  }
}