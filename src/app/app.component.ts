import { AuthService } from './../services/auth';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';

import { SignIn } from '../pages/sign-in/sign-in';

import { ConnectionService } from './../services/connection';

import { AppIndexPage } from "../pages/app-index/app-index";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = SignIn;

  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              network: Network,
              connectionService: ConnectionService,
              auth: AuthService) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
      network.onConnect().subscribe(() => {
        connectionService.setStatus(true);
      });
      network.onDisconnect().subscribe(() => {
        connectionService.setStatus(false);
      });

      auth.currentUser().then((result) => {
        if(result){
          this.rootPage = AppIndexPage
        }
      })

    });
  }
}

