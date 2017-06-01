import { NgForm } from '@angular/forms';
import { Component } from '@angular/core';

import { LoadingController, AlertController, NavController } from 'ionic-angular';

import { FrequencyPage } from '../frequency/frequency';

import { AuthService } from '../../services/auth';
import { ConnectionService } from '../../services/connection';

@Component({
  selector: 'page-sign-in',
  templateUrl: 'sign-in.html',
})
export class SignIn {
  constructor(
    private auth: AuthService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private connection: ConnectionService
  ){
  }
  loginForm(form: NgForm ){

    const credential = form.value.credential;
    const password = form.value.password;

    const loading = this.loadingCtrl.create({
      content: 'Carregando...'
    });
    loading.present();
    this.auth.signIn(credential, password)
      .then(result => {
        loading.dismiss();
        this.auth.setCurrentUser(result);
        this.navCtrl.push(FrequencyPage);
      })
      .catch(error => {
          loading.dismiss();
          const alert = this.alertCtrl.create({
            title: 'Dados inválidos.',
            message: "Não foi possível efetuar login",
            buttons: ['Ok']
          });
          alert.present();
      });
  }
  test(){
    console.log(this.connection.isOnline());
  }

}
