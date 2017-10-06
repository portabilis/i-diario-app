import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContentRecordFormPage } from './content-record-form';

@NgModule({
  declarations: [
    ContentRecordFormPage,
  ],
  imports: [
    IonicPageModule.forChild(ContentRecordFormPage),
  ],
  exports: [
    ContentRecordFormPage
  ]
})
export class ContentRecordFormPageModule {}
