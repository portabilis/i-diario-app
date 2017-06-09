import { Http, Response } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';

@Injectable()
export class DailyFrequencyStudentService {
  constructor(
    private http: Http,
    private storage: Storage
  ){}

  updateFrequency(id, present, userId){
    const url = "http://localhost:3000/api/v1/daily_frequency_students/" + id + ".json";
    const request = this.http.put(url,
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