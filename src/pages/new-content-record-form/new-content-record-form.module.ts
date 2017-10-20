import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewContentRecordFormPage } from './new-content-record-form';

@NgModule({
  declarations: [
    NewContentRecordFormPage,
  ],
  imports: [
    IonicPageModule.forChild(NewContentRecordFormPage),
  ],
  exports: [
    NewContentRecordFormPage
  ]
})
export class NewContentRecordFormModule {}
