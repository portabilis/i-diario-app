import { Storage } from '@ionic/storage';
import { SignIn } from './../sign-in/sign-in';
import { App, AlertController } from 'ionic-angular';
import { AuthService } from './../../services/auth';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-user-index',
  templateUrl: 'user-index.html',
})
export class UserIndexPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private auth: AuthService,
    private app: App,
    private storage: Storage,
    private alertCtrl: AlertController
  ) {}

  exit() {
    this.storage.get('dailyFrequencyStudentsToSync').then((dailyFrequencyStudentsToSync) => {
      if (dailyFrequencyStudentsToSync) {
        this.showConfirmExit();
      } else {
        this.logout();
      }
    });
  }

  showConfirmExit() {
    let confirm = this.alertCtrl.create({
      title: 'Deseja realmente sair?',
      message: 'Encontramos alguns lançamentos que ainda não foram sincronizados.',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {}
        },
        {
          text: 'Apagar lançamentos e sair',
          handler: () => {
            this.logout();
          }
        }
      ]
    });
    confirm.present();
  }

  logout() {
    this.auth.removeCurrentUser();
    this.app.getRootNav().setRoot(SignIn);
    this.storage.clear();
  }
}
