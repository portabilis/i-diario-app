import { Http, Response } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import { ServerService } from './server';

@Injectable()
export class DailyFrequencyStudentService {
  constructor(
    private http: Http,
    private storage: Storage,
    private server: ServerService
  ){}

  updateFrequency(id, present, userId){
    const request = this.http.put(this.server.getDailyFrequencyStudentsUrl(id),
      {
        present: present,
        user_id: userId
      }
    );
    return request.map((response: Response) => {
      return response.json();
    }).toPromise();
  }
}