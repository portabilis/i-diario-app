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

  getUnities(teacherId: number){
    const request = this.http.get(this.api.getTeacherUnitiesUrl(), { params: { teacher_id: teacherId } } );
    return request.map((response: Response) => {
      return response.json();
    });
  }
}