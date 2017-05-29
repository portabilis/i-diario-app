import { Http, Response } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';

@Injectable()
export class UnitiesService {
  constructor(
    private http: Http,
    private storage: Storage
  ){}

  getUnities(teacherId: string){
    const url = "http://localhost:3000/api/v1/teacher_unities.json";
    const request = this.http.get(url, { params: { teacher_id: teacherId } } );
    return request.map((response: Response) => {
      return response.json();
    }).toPromise();
  }
}