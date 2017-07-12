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

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private storage: Storage) {
  }

  ionViewDidLoad() {
    this.lessonPlanId = this.navParams.get('lessonPlanId');

    this.storage.get('lesson_plans').then((lesson_plans) => {
      let details = this.getLessonPlanDetail(lesson_plans);
      this.description = details.description + ' - ' + details.classroom_name;
      this.unity_name = details.unity_name;
      this.period = details.period;
      this.objectives = details.objectives;
      this.activities = details.activities;
      this.evaluation = details.evaluation;
      this.bibliography = details.bibliography;
      this.contents = details.contents;
      // this.contents = this.arrayDescriptionToString(details.contents);


      // console.log(this.arrayDescriptionToString(details.contents));
    });
  }

  // arrayDescriptionToString(elements) {
  //   let text: string = "";

  //   elements.forEach(element => {
  //     text += "<br />- " + element.description;
  //   });

  //   return text;
  // }

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

}
