import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AppIndexPage } from './app-index';

@NgModule({
  declarations: [
    AppIndexPage,
  ],
  imports: [
    IonicPageModule.forChild(AppIndexPage),
  ],
  exports: [
    AppIndexPage
  ]
})
export class AppIndexPageModule {}
