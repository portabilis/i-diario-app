import { Storage } from '@ionic/storage';
import { SignIn } from './../sign-in/sign-in';
import { App } from 'ionic-angular';
import { AuthService } from './../../services/auth';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MessagesService } from './../../services/messages';
import { Observable } from 'rxjs/Observable';
import { Device } from '@ionic-native/device';

@IonicPage()
@Component({
  selector: 'page-user-index',
  templateUrl: 'user-index.html',
})
export class UserIndexPage {
  binary_version: string;
  minor_version: string;
  user_email: string;
  user_full_name: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private auth: AuthService,
    private app: App,
    private storage: Storage,
    private messages: MessagesService,
    public device: Device
  ) {
    this.getDeployInfo();
    this.storage.get('user').then((user) => {
      this.user_email = user.email;
      this.user_full_name = user.first_name + ' ' + user.last_name;
    });
  }

  exit() {
    Observable.forkJoin(
      Observable.fromPromise(this.storage.get('dailyFrequencyStudentsToSync')),
      Observable.fromPromise(this.storage.get('contentRecordsToSync'))
    ).subscribe(
      (results) => {
        let dailyFrequencyStudentsToSync = results[0];
        let contentRecordsToSync = results[1] || [];

      if (
          (dailyFrequencyStudentsToSync && dailyFrequencyStudentsToSync.length) ||
          (contentRecordsToSync && contentRecordsToSync.length)
        ) {
        this.showConfirmExit();
      } else {
        this.logout();
      }
    });
  }

  showConfirmExit() {
    this.messages.showError('Encontramos alguns lançamentos que ainda não foram sincronizados.',
                            'Deseja realmente sair?',
                            [
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
                            ]);
  }

  logout() {
    this.auth.removeCurrentUser();
    this.app.getRootNav().setRoot(SignIn);
    this.storage.clear();
  }

  async getDeployInfo() {
    this.binary_version = '56';
    this.minor_version = '1';
  }
}
