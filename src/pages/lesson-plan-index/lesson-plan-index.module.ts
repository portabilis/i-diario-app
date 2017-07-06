import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LessonPlanIndexPage } from './lesson-plan-index';

@NgModule({
  declarations: [
    LessonPlanIndexPage,
  ],
  imports: [
    IonicPageModule.forChild(LessonPlanIndexPage),
  ],
  exports: [
    LessonPlanIndexPage
  ]
})
export class LessonPlanIndexPageModule {}
