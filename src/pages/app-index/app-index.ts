import { OfflineDataPersisterService } from './../../services/offline_data_persistence/offline_data_persister';
import { AuthService } from './../../services/auth';
import { TeachingPlanIndexPage } from './../teaching-plan-index/teaching-plan-index';
import { LessonPlanIndexPage } from './../lesson-plan-index/lesson-plan-index';
import { UserIndexPage } from './../user-index/user-index';
import { FrequencyIndexPage } from './../frequency-index/frequency-index';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-app-index',
  templateUrl: 'app-index.html',
})
export class AppIndexPage {
  tab1: any;
  tab3: any;
  tab4: any;
  tab5: any;
  tab6: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private _auth: AuthService,
              private _offlineDataPersister: OfflineDataPersisterService,
              private loadingCtrl: LoadingController,
              private _alertCtrl: AlertController
             ){
    this.tab1 = FrequencyIndexPage;
    this.tab3 = LessonPlanIndexPage;
    this.tab4 = TeachingPlanIndexPage
    this.tab5 = UserIndexPage;
  }

  ionViewDidLoad() {
    const loading = this.loadingCtrl.create({
      content: 'Aguarde, estamos deixando tudo pronto para você.'
    })
    loading.present()

    this._auth.currentUser().then((user) => {
      this._offlineDataPersister.persist(user).subscribe(
        (result) => {
        },
        (error) => {
          loading.dismiss();
          this.showErrorAlert();
        },
        () => {
          loading.dismiss();
        }
      )
    });
  }

  showErrorAlert() {
    let alert = this._alertCtrl.create({
      title: 'Erro',
      subTitle: 'Não foi possível realizar a sincronização.',
      buttons: ['OK']
    });
    alert.present();
  }
}
