import { LessonPlanIndexPage } from './../lesson-plan-index/lesson-plan-index';
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
  tab3: any;
  tab5: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.tab1 = FrequencyIndexPage;
    this.tab3 = LessonPlanIndexPage;
    this.tab5 = UserIndexPage;
  }

}