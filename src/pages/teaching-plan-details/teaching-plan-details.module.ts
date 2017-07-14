import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TeachingPlanDetailsPage } from './teaching-plan-details';

@NgModule({
  declarations: [
    TeachingPlanDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(TeachingPlanDetailsPage),
  ],
  exports: [
    TeachingPlanDetailsPage
  ]
})
export class TeachingPlanDetailsPageModule {}
