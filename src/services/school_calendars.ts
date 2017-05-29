import { Http, Response } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';

@Injectable()
export class SchoolCalendarsService {
  constructor(
    private http: Http,
    private storage: Storage
  ){}

  getSchoolCalendar(unityId: string){
    const url = "http://localhost:3000/api/v1/calendarios-letivo.json";
    const request = this.http.get(url, { params: { unity_id: unityId } } );
    return request.map((response: Response) => {
      return response.json();
    }).toPromise();
  }

  getClasses(class_number){
    let classes = [];
    for (let i = 1; i <= class_number; i++){
      classes.push(i);
    }
    return classes;
  }
}