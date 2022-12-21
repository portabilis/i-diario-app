import { TeachingPlanDetailsPage } from './../teaching-plan-details/teaching-plan-details';
import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SyncProvider } from '../../services/sync';

@IonicPage()
@Component({
  selector: 'page-teaching-plan-index',
  templateUrl: 'teaching-plan-index.html',
})
export class TeachingPlanIndexPage {
  shownGroup = null;

  unities = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private sync: SyncProvider,
              private storage: Storage
             ) {
  }

  ionViewDidLoad() {
    this.updateTeachingPlans();
  }

  doRefresh() {
    this.sync.syncAll().subscribe(() => this.updateTeachingPlans());
  }

  updateTeachingPlans() {
    this.storage.get('teachingPlans').then((teachingPlans) => {
      if (!teachingPlans) return;
      this.unities = [];
      teachingPlans.unities.forEach(unity => {
        let teachingPlans = [];
        unity.plans.forEach(plan => {
          teachingPlans.push({ id: plan.id,
                               description: plan.description + ' - ' + plan.grade_name });
        });
        this.unities.push({ name: unity.unity_name, teachingPlans: teachingPlans});
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

  openDetail(teachingPlanId) {
    this.navCtrl.push(TeachingPlanDetailsPage, { "teachingPlanId": teachingPlanId });
  }
}
