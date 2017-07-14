import { TeachingPlanDetailsPage } from './../teaching-plan-details/teaching-plan-details';
import { ConnectionService } from './../../services/connection';
import { Storage } from '@ionic/storage';
import { AuthService } from './../../services/auth';
import { TeachingPlansService } from './../../services/teaching_plans';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

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
              private auth: AuthService,
              private teachingPlansService: TeachingPlansService,
              private storage: Storage,
              private toastCtrl: ToastController,
              private connectionService: ConnectionService) {
  }

  ionViewDidLoad() {
    this.updateTeachingPlans();
  }

  doRefresh(refresher) {
    this.auth.currentUser().then((user) => {
      this.teachingPlansService.getTeachingPlans(
        user.teacher_id
      ).subscribe(
        (teaching_plans:any) => {
          this.storage.set('teaching_plans', teaching_plans);
        },
        (error) => {
          this.presentErrorToast();
          refresher.cancel();
        },
        () => {
          refresher.complete();
          this.updateTeachingPlans();
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

  updateTeachingPlans() {
    this.storage.get('teaching_plans').then((teaching_plans) => {
      if (!teaching_plans) return;
      this.unities = [];
      teaching_plans.unities.forEach(unity => {
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
