import { UtilsService } from './../../services/utils';
import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-lesson-plan-details',
  templateUrl: 'lesson-plan-details.html',
})
export class LessonPlanDetailsPage {
  lessonPlanId: number;
  description: string;
  unity_name: string;
  period: string;
  objectives: string;
  activities: string;
  evaluation: string;
  bibliography: string;
  contents: string;
  knowledge_areas: string;
  period_date: string;
  opinion: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private utilsService: UtilsService
  ) {}

  ionViewDidLoad() {
    this.lessonPlanId = this.navParams.get('lessonPlanId');

    this.storage.get('lessonPlans').then((lessonPlans) => {
      let details = this.getLessonPlanDetail(lessonPlans);
      this.description = details.description + ' - ' + details.classroom_name;
      this.unity_name = details.unity_name;
      this.period = details.period;
      this.contents = details.contents;
      this.knowledge_areas = details.knowledge_areas;

      this.objectives = this.utilsService.convertTextToHtml(details.objectives);
      this.evaluation = this.utilsService.convertTextToHtml(details.evaluation);
      this.bibliography = this.utilsService.convertTextToHtml(details.bibliography);
      this.activities = this.utilsService.convertTextToHtml(details.activities);
      this.opinion = this.utilsService.convertTextToHtml(details.opinion);
      this.period_date = this.periodDate(details.start_at, details.end_at);
    });
  }

  periodDate(start_at, end_at) {
    start_at = this.utilsService.toBrazilianFormat(new Date(start_at));
    end_at = this.utilsService.toBrazilianFormat(new Date(end_at));
    return start_at + " à " + end_at;
  }

  getLessonPlanDetail(lessonPlan){
    let response;
    lessonPlan.unities.forEach(unity => {
      unity.plans.forEach(plan => {
        if (plan.id == this.lessonPlanId) {
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
