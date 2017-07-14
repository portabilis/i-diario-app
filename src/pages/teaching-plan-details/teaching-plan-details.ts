import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-teaching-plan-details',
  templateUrl: 'teaching-plan-details.html',
})
export class TeachingPlanDetailsPage {
  teachingPlanId: number;
  description: string;
  unity_name: string;
  period: string;
  objectives: string;
  activities: string;
  evaluation: string;
  bibliography: string;
  contents: string;
  knowledge_areas: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private storage: Storage) {
  }

  ionViewDidLoad() {
    this.teachingPlanId = this.navParams.get('teachingPlanId');

    this.storage.get('teaching_plans').then((teaching_plans) => {
      let details = this.getTeachingPlanDetail(teaching_plans);
      this.description = details.description + ' - ' + details.grade_name;
      this.unity_name = details.unity_name;
      this.period = details.period;
      this.activities = details.activities;
      this.evaluation = details.evaluation;
      this.bibliography = details.bibliography;
      this.contents = details.contents;
      this.knowledge_areas = details.knowledge_areas;
    });
  }

  getTeachingPlanDetail(teachingPlan){
    let response;
    teachingPlan.unities.forEach(unity => {
      unity.plans.forEach(plan => {
        if (plan.id == this.teachingPlanId) {
          response = plan;
          return;
        }
      })
    });
    return response;
  }

}
