import { Observable } from 'rxjs/Observable';
import { ConnectionService } from './connection';
import { Http, Response } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';

@Injectable()
export class SchoolCalendarsService {
  constructor(
    private http: Http,
    private storage: Storage,
    private connection: ConnectionService
  ){}

  getSchoolCalendar(unityId: number){
    if(this.connection.isOnline){
      return this.getOnlineSchoolCalendar(unityId)
    }else{
      return this.getOfflineSchoolCalendar(unityId)
    }
  }

  private getOnlineSchoolCalendar(unityId: number){
    const url = "http://localhost:3000/api/v1/calendarios-letivo.json";
    const request = this.http.get(url, { params: { unity_id: unityId } } );
    return request.map((response: Response) => {
      return {
        data: response.json(),
        unityId: unityId
      }
    });
  }

  private getOfflineSchoolCalendar(unityId: number){
    return new Observable((observer) => {
      this.storage.get('schoolCalendars').then((schoolCalendars) => {
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