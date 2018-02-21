import { Observable } from 'rxjs/Observable';
import { ConnectionService } from './connection';
import { ApiService } from './api';
import { Http, Response } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';

@Injectable()
export class CustomersService {
  constructor(
    private http: Http,
    private storage: Storage,
    private connection: ConnectionService,
    private api: ApiService
  ){}

  getCustomers(){
    const request = this.http.get(this.api.getallHostsUrl());
    return request.map((response: Response) => {
      return response.json()['customers'].map((customer) => {
        return {name: customer.name, value: customer.url};
      });
    });
  }
}