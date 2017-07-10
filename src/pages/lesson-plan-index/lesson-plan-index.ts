import { AuthService } from './../../services/auth';
import { LessonPlansService } from './../../services/lesson_plans';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-lesson-plan-index',
  templateUrl: 'lesson-plan-index.html',
})
export class LessonPlanIndexPage {
  shownGroup = null;

  lessons = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private auth: AuthService,
              private lessonPlansService: LessonPlansService) {
  }
  // ionViewDidLoad() {
  //   atualizar lessonplans offline
  // }

  updateLessonPlans(refresher) {
    this.auth.currentUser().then((user) => {
      this.lessonPlansService.getLessonPlans(
        user.teacher_id
      ).subscribe(
        (lessonPlans:any) => {
          lessonPlans.forEach(lessonPlan => {
            this.lessons = [{ unity: lessonPlan.unity_name,
                              disciplines: [lessonPlan.description + ' - ' + lessonPlan.classroom_name] }]
          });
        },
        (error) => {
          console.log(error);
        },
        () => {
          refresher.complete();
        }
      );
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
}
