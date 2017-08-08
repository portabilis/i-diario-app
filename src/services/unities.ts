import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import { ApiService } from './api';

@Injectable()
export class UnitiesService {
  constructor(
    private http: Http,
    private storage: Storage,
    private api: ApiService
  ){}

  getOnlineUnities(teacherId: number){
    const request = this.http.get(this.api.getTeacherUnitiesUrl(), { params: { teacher_id: teacherId } } );
    return request.map((response: Response) => {
      return response.json();
    });
  }

  getOfflineUnities(teacherId: number){
    return new Observable((observer) => {
      this.storage.get('unities').then((unities) => {
        observer.next(unities)
        observer.complete()
      })
    })
  }
}