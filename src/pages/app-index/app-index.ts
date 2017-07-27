import { AuthService } from './../../services/auth';
import { OnlineDataService } from './../../services/online_data';
import { TeachingPlanIndexPage } from './../teaching-plan-index/teaching-plan-index';
import { LessonPlanIndexPage } from './../lesson-plan-index/lesson-plan-index';
import { SynchronizationPage } from './../synchronization/synchronization';
import { UserIndexPage } from './../user-index/user-index';
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
  tab4: any;
  tab5: any;
  tab6: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private _onlineData: OnlineDataService,
              private _auth: AuthService
             ){
    this.tab1 = FrequencyIndexPage;
    this.tab3 = LessonPlanIndexPage;
    this.tab4 = TeachingPlanIndexPage
    this.tab5 = UserIndexPage;
    this.tab6 = SynchronizationPage;
  }

  ionViewDidLoad() {
    this._auth.currentUser().then((user) => {
      this._onlineData.retrieve(user);
    });
  }
}
