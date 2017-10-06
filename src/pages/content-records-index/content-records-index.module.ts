import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContentRecordsIndexPage } from './content-records-index';

@NgModule({
  declarations: [
    ContentRecordsIndexPage,
  ],
  imports: [
    IonicPageModule.forChild(ContentRecordsIndexPage),
  ],
  exports: [
    ContentRecordsIndexPage
  ]
})
export class ContentRecordsIndexPageModule {}
