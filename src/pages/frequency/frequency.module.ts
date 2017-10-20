import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FrequencyPage } from './frequency';

@NgModule({
  declarations: [
    FrequencyPage,
  ],
  imports: [
    IonicPageModule.forChild(FrequencyPage),
  ],
  exports: [
    FrequencyPage
  ]
})
export class FrequencyModule {}
