import { NgForm } from '@angular/forms';
import { Component } from '@angular/core';

import { LoadingController, AlertController, NavController } from 'ionic-angular';

import { FrequencyPage } from '../frequency/frequency';

import { AuthService } from '../../services/auth';
import { ConnectionService } from '../../services/connection';
import { UnitiesService } from '../../services/unities';

import { Unity } from '../../data/unity.interface';
import { User } from '../../data/user.interface';

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
    private connection: ConnectionService,
    private unitiesService: UnitiesService
  ){}

  loginForm(form: NgForm ){
    const credential = form.value.credential;
    const password = form.value.password;

    const loading = this.loadingCtrl.create({
      content: 'Carregando...'
    });
    loading.present();
    this.auth.signIn(credential, password).subscribe(
      (user: User) => {
        this.unitiesService.getUnities(user.teacher_id).subscribe(
          (unities: Unity[]) => {
            this.auth.setCurrentUser(user);
            this.navCtrl.push(FrequencyPage, { "unities": unities });
          },
          (error) => {
            console.log(error)
          },
          () => {
            loading.dismiss();
          }
        )
      },
    (error) => {
      loading.dismiss();
      const alert = this.alertCtrl.create({
        title: 'Dados inválidos.',
        message: "Não foi possível efetuar login",
        buttons: ['Ok']
      });
      alert.present();
    }
  )
  }
}
