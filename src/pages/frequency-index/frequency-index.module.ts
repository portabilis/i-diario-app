import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FrequencyIndexPage } from './frequency-index';

@NgModule({
  declarations: [
    FrequencyIndexPage,
  ],
  imports: [
    IonicPageModule.forChild(FrequencyIndexPage),
  ],
  exports: [
    FrequencyIndexPage
  ]
})
export class FrequencyIndexPageModule {}
