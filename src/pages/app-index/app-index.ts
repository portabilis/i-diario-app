import { OfflineDataPersisterService } from './../../services/offline_data_persistence/offline_data_persister';
import { AuthService } from './../../services/auth';
import { TeachingPlanIndexPage } from './../teaching-plan-index/teaching-plan-index';
import { LessonPlanIndexPage } from './../lesson-plan-index/lesson-plan-index';
import { ContentRecordsIndexPage } from './../content-records-index/content-records-index';
import { UserIndexPage } from './../user-index/user-index';
import { FrequencyIndexPage } from './../frequency-index/frequency-index';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-app-index',
  templateUrl: 'app-index.html',
})
export class AppIndexPage {
  tab1: any;
  tab2: any;
  tab3: any;
  tab4: any;
  tab5: any;
  tab6: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private _auth: AuthService,
              private _offlineDataPersister: OfflineDataPersisterService,
              private loadingCtrl: LoadingController,
             ){
    this.tab1 = FrequencyIndexPage;
    this.tab2 = ContentRecordsIndexPage;
    this.tab3 = LessonPlanIndexPage;
    this.tab4 = TeachingPlanIndexPage
    this.tab5 = UserIndexPage;
  }
}
