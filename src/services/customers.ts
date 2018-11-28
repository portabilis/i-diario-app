import { ApiService } from './api';
import { Response } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import { CustomHttp } from './custom_http';

@Injectable()
export class CustomersService {
  constructor(
    private http: CustomHttp,
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