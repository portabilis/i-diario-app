import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SynchronizationPage } from './synchronization';

@NgModule({
  declarations: [
    SynchronizationPage,
  ],
  imports: [
    IonicPageModule.forChild(SynchronizationPage),
  ],
  exports: [
    SynchronizationPage
  ]
})
export class SynchronizationPageModule {}
