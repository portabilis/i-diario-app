import { SignIn } from './../sign-in/sign-in';
import { FrequencyIndexPage } from './../frequency-index/frequency-index';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the AppIndexPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-app-index',
  templateUrl: 'app-index.html',
})
export class AppIndexPage {
  tab1: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.tab1 = FrequencyIndexPage;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AppIndexPage');
  }

}
