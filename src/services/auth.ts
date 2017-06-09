import { Http, Response } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';

@Injectable()
export class AuthService {
  constructor(
    private http: Http,
    private storage: Storage
  ) {}

  signIn(credential, password){
    const url = "http://localhost:3000/usuarios/logar.json";
    const request = this.http.post(url, { user: { credentials: credential, password: password } });
    return request.map((response: Response) => {
      return response.json();
    });
  }

  isSignedIn(){
    this.storage.get('user').then(result => {
      return true;
    }).catch(error => {
      return false;
    });
  }

  currentUser(){
    return this.storage.get('user');
  }

  setCurrentUser(user){
    this.storage.set('user', user);
  }

  removeCurrentUser(){
    this.storage.remove('user');
  }
}