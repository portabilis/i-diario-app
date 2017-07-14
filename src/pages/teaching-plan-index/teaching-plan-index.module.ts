import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TeachingPlanIndexPage } from './teaching-plan-index';

@NgModule({
  declarations: [
    TeachingPlanIndexPage,
  ],
  imports: [
    IonicPageModule.forChild(TeachingPlanIndexPage),
  ],
  exports: [
    TeachingPlanIndexPage
  ]
})
export class TeachingPlanIndexPageModule {}
