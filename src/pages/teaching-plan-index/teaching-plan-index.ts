import { UtilsService } from './../../services/utils';
import { TeachingPlanDetailsPage } from './../teaching-plan-details/teaching-plan-details';
import { Storage } from '@ionic/storage';
import { AuthService } from './../../services/auth';
import { TeachingPlansService } from './../../services/teaching_plans';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MessagesService } from './../../services/messages';
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
              private auth: AuthService,
              private teachingPlansService: TeachingPlansService,
              private storage: Storage,
              private utilsService: UtilsService,
              private messages: MessagesService,
             ) {
  }

  ionViewDidLoad() {
    this.updateTeachingPlans();
  }

  doRefresh() {
    this.sync.setSyncDate();

    this.sync.verifyWifi().subscribe(continueSync => {
      let refresher = this.sync;
      refresher.start();

      if (continueSync) {
        this.utilsService.hasAvailableStorage().then((available) => {
          if (!available) {
            this.messages.showError(this.messages.insuficientStorageErrorMessage('sincronizar planos de ensino'));
            refresher.cancel();
            return;
          }
    
          this.auth.currentUser().then((user) => {
            this.teachingPlansService.getTeachingPlans(
              user.teacher_id
            ).subscribe(
              (teachingPlans:any) => {
                this.storage.set('teachingPlans', teachingPlans);
              },
              (error) => {
                this.utilsService.showRefreshPageError();
                refresher.cancel();
              },
              () => {
                refresher.complete();
                this.updateTeachingPlans();
              }
            );
          });
        });
      } else 
        refresher.cancel();
    });
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
