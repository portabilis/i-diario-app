import { Injectable } from '@angular/core';
import { AlertController, ToastController } from 'ionic-angular';

@Injectable()
export class MessagesService {
  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
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

  public showAlert(message,
    title='Mensagem',
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
  };

  public showToast(message,
                   duration=3000,
                   position='middle'){
    let toast = this.toastCtrl.create({
      message: message,
      duration: duration,
      position: position,
    });
    toast.present();
  }

  public insuficientStorageErrorMessage(action) {
    return `Espaço de armazenamento insuficiente no dispositivo para ${action}. São necessários, no mínimo, 50 MB livres para executar a operação.`;
  }
}