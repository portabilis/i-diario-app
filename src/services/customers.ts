import { ApiService } from './api';
import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';

@Injectable()
export class CustomersService {
  constructor(
    private http: Http,
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