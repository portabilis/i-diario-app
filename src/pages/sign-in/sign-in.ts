import { AuthService } from '../../services/auth';
import { NgForm } from '@angular/forms';
import { Component } from '@angular/core';
import { LoadingController, AlertController } from 'ionic-angular';

@Component({
  selector: 'page-sign-in',
  templateUrl: 'sign-in.html',
})
export class SignIn {
  constructor(
    private auth: AuthService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ){

  }
  loginForm(form: NgForm ){

    const url = "http://localhost:3000/usuarios/logar.json";
    
    const credential = form.value.credential;
    const password = form.value.password;


    const loading = this.loadingCtrl.create({
      content: 'Carregando...'
    });
    loading.present();
    const result = this.auth.signIn(credential, password)
      .then(result => {
        loading.dismiss();
        this.auth.setCurrentUser(result);
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

}
