import { NgForm } from '@angular/forms';
import { Component, ChangeDetectorRef } from '@angular/core';

import { LoadingController, NavController } from 'ionic-angular';
import { AppIndexPage } from "../app-index/app-index";

import { AuthService } from '../../services/auth';
import { ConnectionService } from '../../services/connection';
import { UnitiesService } from '../../services/unities';
import { CustomersService } from '../../services/customers';
import { ApiService } from './../../services/api';
import { UtilsService } from './../../services/utils';

import { User } from '../../data/user.interface';
import { MessagesService } from '../../services/messages';

@Component({
  selector: 'page-sign-in',
  templateUrl: 'sign-in.html'
})
export class SignIn {
  private cities = [];
  private anyError:Boolean = false;
  private errorMessage:String = "";
  serverUrl: string = "";
  isOnline: Boolean = false;
  placeholder: String = "Municípios";

  constructor(
    private auth: AuthService,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private connection: ConnectionService,
    private unitiesService: UnitiesService,
    private customersService: CustomersService,
    private api: ApiService,
    private utilsService: UtilsService,
    private messages: MessagesService,
    private cdr: ChangeDetectorRef
  ){}

  ionViewWillEnter(){
    this.isOnline = this.connection.isOnline;
    this.changeInputMunicipios(this.isOnline);
    this.connection.eventOnline.subscribe((online) => this.changeInputMunicipios(online));
  }

  changeInputMunicipios(online){
    this.isOnline = online;
    if(!this.isOnline){
      this.messages.showToast('Sem conexão!',6000,'top');
      this.placeholder = "Sem conexão"
      this.serverUrl = "";
    }else{
      this.getCustomers();
    }
  }

  getCustomers(){
    this.placeholder = "Carregando..";
    this.cdr.detectChanges();
    this.customersService.getCustomers().subscribe( data => {
      this.cities = data;
    },
    error => {},
    () => {
      this.placeholder = "Município";
      this.cdr.detectChanges();
    });
  }

  loginForm(form: NgForm ){
    const credential = form.value.credential;
    const password = form.value.password;
    const host = /^[a-z0-9]+:\/\//.test(form.value.serverUrl) ? form.value.serverUrl : "https://" + form.value.serverUrl;
    this.api.setServerUrl(host);

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
    let currentHour = this.utilsService.getCurrentDate().getHours();

    let greeting = "bom dia";

    if(currentHour >= split_afternoon && currentHour <= split_evening) {
      greeting = 'boa tarde';
    } else if(currentHour >= split_evening) {
      greeting = 'boa noite';
    }

    return `Olá, ${greeting}!`;
  }

  openUrl(url) {
    this.utilsService.openUrl(url);
  }
}
