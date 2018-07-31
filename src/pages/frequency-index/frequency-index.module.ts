import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FrequencyIndexPage } from './frequency-index';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    FrequencyIndexPage,
  ],
  imports: [
    IonicPageModule.forChild(FrequencyIndexPage),
    ComponentsModule,
  ],
  exports: [
    FrequencyIndexPage
  ]
})
export class FrequencyIndexPageModule {}
