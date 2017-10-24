import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SignIn } from './sign-in';
import { AppPipesModule } from '../../pipes/app-pipes.module';

@NgModule({
  declarations: [
    SignIn,
  ],
  imports: [
    IonicPageModule.forChild(SignIn),
    AppPipesModule
  ],
  exports: [
    SignIn
  ]
})
export class SignInModule {}
