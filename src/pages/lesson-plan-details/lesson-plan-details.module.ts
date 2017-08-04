import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LessonPlanDetailsPage } from './lesson-plan-details';

@NgModule({
  declarations: [
    LessonPlanDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(LessonPlanDetailsPage),
  ],
  exports: [
    LessonPlanDetailsPage
  ]
})
export class LessonPlanDetailsPageModule {}
