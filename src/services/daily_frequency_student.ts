import { Http, Response } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import { ApiService } from './api';

@Injectable()
export class DailyFrequencyStudentService {
  constructor(
    private http: Http,
    private storage: Storage,
    private api: ApiService
  ){}

  updateFrequency(id, present, userId){
    const request = this.http.put(this.api.getDailyFrequencyStudentsUrl(id),
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