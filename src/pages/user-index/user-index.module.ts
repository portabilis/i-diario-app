import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserIndexPage } from './user-index';

@NgModule({
  declarations: [
    UserIndexPage,
  ],
  imports: [
    IonicPageModule.forChild(UserIndexPage),
  ],
  exports: [
    UserIndexPage
  ]
})
export class UserIndexPageModule {}
