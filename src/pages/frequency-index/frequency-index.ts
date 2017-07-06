import { AuthService } from './../../services/auth';
import { FrequencyPage } from './../frequency/frequency';
import { Unity } from './../../data/unity.interface';
import { UnitiesService } from './../../services/unities';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

/**
 * Generated class for the FrequencyIndexPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-frequency-index',
  templateUrl: 'frequency-index.html'
})
export class FrequencyIndexPage {
  private user: any;
  shownGroup = null;

  frequencies = [
    { school: "E.E.B. Antônio Guglielme Sobilinaldo", classes: ["Maternal 1", "Maternal 2"] },
    { school: "E.E.B. Salete Scott Santos", classes: "" }
  ];


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private loadingCtrl: LoadingController,
              private unitiesService: UnitiesService,
              private auth: AuthService) {
  }

  ionViewWillEnter(){
    this.auth.currentUser().then((user) => {
      this.user = user;
    })
  }

  newFrequency() {
    const loading = this.loadingCtrl.create({
      content: 'Carregando...'
    });
    loading.present();
    this.unitiesService.getUnities(this.user.teacher_id).subscribe(
      (unities: Unity[]) => {
        this.navCtrl.push(FrequencyPage, { "unities": unities });
      },
      (error) => {
        console.log(error)
      },
      () => {
        loading.dismiss();
      });
  }

  toggleGroup(group) {
    if (this.isGroupShown(group)) {
        this.shownGroup = null;
    } else {
        this.shownGroup = group;
    }
  };
  isGroupShown(group) {
      return this.shownGroup === group;
  };

}