import { SynchronizationPage } from './../synchronization/synchronization';
import { UserIndexPage } from './../user-index/user-index';
import { SignIn } from './../sign-in/sign-in';
import { FrequencyIndexPage } from './../frequency-index/frequency-index';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-app-index',
  templateUrl: 'app-index.html',
})
export class AppIndexPage {
  tab1: any;
  tab5: any;
  tab6: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.tab1 = FrequencyIndexPage;
    this.tab5 = UserIndexPage;
    this.tab6 = SynchronizationPage;
  }

  ionViewDidLoad() {
    // const loading = this.loadingCtrl.create({
    //   content: 'Carregando...'
    // })
    // loading.present()

    // this._auth.currentUser().then((user) => {
    //   this._offlineDataPersister.persist(user).subscribe(
    //     (result) => {
    //     },
    //     (error) => {
    //     },
    //     () => {
    //       loading.dismiss();
    //     }
    //   )
    // });
  }
}
