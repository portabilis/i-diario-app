import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the LessonPlanIndexPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-lesson-plan-index',
  templateUrl: 'lesson-plan-index.html',
})
export class LessonPlanIndexPage {
  shownGroup = null;

  lessons = [
    { school: "Antônio Guglielme Sobrinho", disciplines: ["Filosofia - 5º ano 3",
                                                          "Filosofia - 5º ano 2",
                                                          "Filosofia - 5º ano 1",
                                                          "Filosofia - 6º ano 2",
                                                          "Filosofia - 6º ano 1"] },
    { school: "E.E.B. Salete Scott Santos", disciplines: "" }
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LessonPlanIndexPage');
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
