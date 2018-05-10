import { Observable } from 'rxjs/Observable';
import { ApiService } from './api';
import { Http, Response } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';

@Injectable()
export class SchoolCalendarsService {
  constructor(
    private http: Http,
    private storage: Storage,
    private api: ApiService
  ){}

  getOnlineSchoolCalendar(unityId: number){
    const request = this.http.get(this.api.getSchoolCalendarUrl(), { params: { unity_id: unityId } } );
    return request.map((response: Response) => {
      return {
        data: response.json(),
        unityId: unityId
      }
    });
  }

  getOfflineSchoolCalendar(unityId: number){
    return new Observable((observer) => {
      this.storage.get('schoolCalendars').then((schoolCalendars) => {
        if (!schoolCalendars){
          observer.complete();
          return;
        }

        schoolCalendars.forEach((schoolCalendar) => {
          if(schoolCalendar.unityId == unityId){
            observer.next(schoolCalendar)
            observer.complete()
          }
        })
      })
    })
  }

  getClasses(class_number){
    let classes = [];
    for (let i = 1; i <= class_number; i++){
      classes.push(i);
    }
    return classes;
  }
}
