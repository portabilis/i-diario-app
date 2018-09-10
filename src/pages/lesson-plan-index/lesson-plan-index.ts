import { UtilsService } from './../../services/utils';
import { LessonPlanDetailsPage } from './../lesson-plan-details/lesson-plan-details';
import { Storage } from '@ionic/storage';
import { AuthService } from './../../services/auth';
import { LessonPlansService } from './../../services/lesson_plans';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MessagesService } from './../../services/messages';
import { SyncProvider } from '../../services/sync';

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
              private sync: SyncProvider,
              private auth: AuthService,
              private lessonPlansService: LessonPlansService,
              private storage: Storage,
              private utilsService: UtilsService,
              private messages: MessagesService,
             ) {
  }

  ionViewDidLoad() {
    this.updateLessonPlans();
  }

  doRefresh(refresher) {
    this.sync.setSyncDate();

    this.sync.verifyWifi().subscribe(continueSync => {

      if(refresher.type === 'click') {
        refresher = this.sync;
        refresher.start();
      }

      if (continueSync) {
        this.utilsService.hasAvailableStorage().then((available) => {
          if (!available) {
            this.messages.showError(this.messages.insuficientStorageErrorMessage('sincronizar planos de aula'));
            refresher.cancel();
            return;
          }
    
          this.auth.currentUser().then((user) => {
            this.lessonPlansService.getLessonPlans(
              user.teacher_id
            ).subscribe(
              (lessonPlans:any) => {
                this.storage.set('lessonPlans', lessonPlans);
              },
              (error) => {
                this.utilsService.showRefreshPageError();
                refresher.cancel();
              },
              () => {
                refresher.complete();
                this.updateLessonPlans();
              }
            );
          });
        });
      } else 
        refresher.cancel();
    });
  }

  updateLessonPlans() {
    this.storage.get('lessonPlans').then((lessonPlans) => {
    if (!lessonPlans) return;
    this.unities = [];
      lessonPlans.unities.forEach(unity => {
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
