import { NgForm } from '@angular/forms';
import { Component } from '@angular/core';

import { LoadingController, AlertController, NavController } from 'ionic-angular';
import { SafariViewController } from '@ionic-native/safari-view-controller';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AppIndexPage } from "../app-index/app-index";

import { AuthService } from '../../services/auth';
import { ConnectionService } from '../../services/connection';
import { UnitiesService } from '../../services/unities';
import { CustomersService } from '../../services/customers';
import { ApiService } from './../../services/api';

import { User } from '../../data/user.interface';

@Component({
  selector: 'page-sign-in',
  templateUrl: 'sign-in.html'
})
export class SignIn {
  private cities = [];
  private anyError:Boolean = false;
  private errorMessage:String = "";

  constructor(
    private auth: AuthService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private connection: ConnectionService,
    private unitiesService: UnitiesService,
    private customersService: CustomersService,
    private api: ApiService,
    private safariViewController: SafariViewController,
    private iab: InAppBrowser,
  ){}

  ionViewWillEnter(){
    this.customersService.getCustomers().subscribe( data => {
      this.cities = data;
    });
  }

  loginForm(form: NgForm ){
    const credential = form.value.credential;
    const password = form.value.password;

    this.api.setServerUrl(form.value.serverUrl);

    const loading = this.loadingCtrl.create({
      content: 'Carregando...'
    });
    loading.present();
    this.auth.signIn(credential, password).subscribe(
      (user: User) => {
        this.auth.setCurrentUser(user);
        this.navCtrl.push(AppIndexPage, {'user': user});
      },
    (error) => {
      this.anyError = true;
      this.errorMessage = "Não foi possível efetuar login.";
      loading.dismiss();
    },
    () => {
      loading.dismiss();
    })
  }

  greetingText() {
    let split_afternoon = 12;
    let split_evening = 17;
    let currentHour = new Date().getHours();

    let greeting = "bom dia";

    if(currentHour >= split_afternoon && currentHour <= split_evening) {
      greeting = 'boa tarde';
    } else if(currentHour >= split_evening) {
      greeting = 'boa noite';
    }

    return `Olá, ${greeting}!`;
  }

  openUrl(url) {
    this.safariViewController.isAvailable().then((available: boolean) => {
        if (available) {
          this.safariViewController.show({
            url: 'http://ionic.io',
            hidden: false,
            animated: false,
            transition: 'curl',
            enterReaderModeIfAvailable: true,
            tintColor: '#ff0000'
          });
        } else {
          const browser = this.iab.create(url);
        }
      }
    );
  }
}
