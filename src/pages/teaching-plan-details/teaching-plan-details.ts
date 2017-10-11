import { UtilsService } from './../../services/utils';
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
  year: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private utilsService: UtilsService
  ) {}

  ionViewDidLoad() {
    this.teachingPlanId = this.navParams.get('teachingPlanId');

    this.storage.get('teachingPlans').then((teachingPlans) => {
      let details = this.getTeachingPlanDetail(teachingPlans);
      this.description = details.description + ' - ' + details.grade_name;
      this.unity_name = details.unity_name;
      this.period = details.period;
      this.contents = details.contents;
      this.knowledge_areas = details.knowledge_areas;
      this.year = details.year;

      this.objectives = this.utilsService.convertTextToHtml(details.objectives);
      this.evaluation = this.utilsService.convertTextToHtml(details.evaluation);
      this.bibliography = this.utilsService.convertTextToHtml(details.bibliography);
      this.activities = this.utilsService.convertTextToHtml(details.activities);
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

  goBack() {
    this.navCtrl.pop();
  }

}
