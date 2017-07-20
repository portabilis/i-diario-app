import { NgForm } from '@angular/forms';
import { Component } from '@angular/core';

import { LoadingController, AlertController, NavController } from 'ionic-angular';

import { AppIndexPage } from "../app-index/app-index";

import { AuthService } from '../../services/auth';
import { ConnectionService } from '../../services/connection';
import { UnitiesService } from '../../services/unities';
import { ApiService } from './../../services/api';

import { User } from '../../data/user.interface';

@Component({
  selector: 'page-sign-in',
  templateUrl: 'sign-in.html'
})
export class SignIn {
  private cities = [];

  constructor(
    private auth: AuthService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private connection: ConnectionService,
    private unitiesService: UnitiesService,
    private api: ApiService
  ){}

  ionViewWillEnter(){
    this.cities = this.api.allHosts;
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
      loading.dismiss();
      const alert = this.alertCtrl.create({
        title: 'Dados inválidos.',
        message: "Não foi possível efetuar login",
        buttons: ['Ok']
      });
      alert.present();
    },
    () => {
      loading.dismiss();
    }
  )
  }
}
