import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FrequencyIndexPage } from './frequency-index';
import { TooltipComponentModule } from '../../components/tooltip/tooltip.module';

@NgModule({
  declarations: [
    FrequencyIndexPage,
  ],
  imports: [
    IonicPageModule.forChild(FrequencyIndexPage),
    TooltipComponentModule,
  ],
  exports: [
    FrequencyIndexPage
  ]
})
export class FrequencyIndexPageModule {}
