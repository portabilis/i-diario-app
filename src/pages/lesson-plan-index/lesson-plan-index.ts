import { LessonPlanDetailsPage } from './../lesson-plan-details/lesson-plan-details';
import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SyncProvider } from '../../services/sync';

@IonicPage()
@Component({
  selector: 'page-lesson-plan-index',
  templateUrl: 'lesson-plan-index.html',
})
export class LessonPlanIndexPage {
  shownGroup = null;

  unities = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private sync: SyncProvider,
              private storage: Storage
             ) {
  }

  ionViewDidLoad() {
    this.updateLessonPlans();
  }

  ionViewDidEnter() {
    this.updateLessonPlans();
  }

  doRefresh() {
    this.sync.syncAll().subscribe(() => this.updateLessonPlans());
  }

  updateLessonPlans() {
    this.storage.get('lessonPlans').then((lessonPlans) => {
    if (!lessonPlans) return;
    this.unities = [];
      lessonPlans.unities.forEach(unity => {
        if ((unity.plans||[]).length == 0) {
          return;
        }

        let lessonPlans = [];
        unity.plans.forEach(plan => {
          lessonPlans.push({ id: plan.id,
                             description: plan.description + ' - ' + plan.classroom_name });
        });

        this.unities.push({ name: unity.unity_name, lessonPlans: lessonPlans});
      });
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

  openDetail(lessonPlanId) {
    this.navCtrl.push(LessonPlanDetailsPage, { "lessonPlanId": lessonPlanId });
  }
}
