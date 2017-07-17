import { LessonPlanDetailsPage } from './../lesson-plan-details/lesson-plan-details';
import { ConnectionService } from './../../services/connection';
import { Storage } from '@ionic/storage';
import { AuthService } from './../../services/auth';
import { LessonPlansService } from './../../services/lesson_plans';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

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
              private auth: AuthService,
              private lessonPlansService: LessonPlansService,
              private storage: Storage,
              private toastCtrl: ToastController,
              private connectionService: ConnectionService) {
  }

  ionViewDidLoad() {
    this.updateLessonPlans();
  }

  doRefresh(refresher) {
    this.auth.currentUser().then((user) => {
      this.lessonPlansService.getLessonPlans(
        user.teacher_id
      ).subscribe(
        (lesson_plans:any) => {
          this.storage.set('lesson_plans', lesson_plans);
        },
        (error) => {
          this.presentErrorToast();
          refresher.cancel();
        },
        () => {
          refresher.complete();
          this.updateLessonPlans();
        }
      );
    });
  }

  presentErrorToast() {
    let offlineMessage = "";

    if(!this.connectionService.isOnline){
      offlineMessage = " Parece que você está offline";
    }

    let toast = this.toastCtrl.create({
      message: 'Não foi possível completar a atualização.' + offlineMessage,
      duration: 3000,
      position: 'down'
    });

    toast.present();
  }

  updateLessonPlans() {
    this.storage.get('lesson_plans').then((lesson_plans) => {
    if (!lesson_plans) return;
    this.unities = [];
      lesson_plans.unities.forEach(unity => {
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
