import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-synchronization',
  templateUrl: 'synchronization.html',
})
export class SynchronizationPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewWillLoad() {
    console.log('ionViewDidLoad SynchronizationPage');
  }

}
