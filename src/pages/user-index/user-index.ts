import { SignIn } from './../sign-in/sign-in';
import { App } from 'ionic-angular';
import { AuthService } from './../../services/auth';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-user-index',
  templateUrl: 'user-index.html',
})
export class UserIndexPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private auth: AuthService,
              private app: App) {
  }

  exit() {
    this.auth.removeCurrentUser();
    this.app.getRootNav().setRoot(SignIn);
  }

}
