import { Http, Response, ResponseOptions } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';

@Injectable()
export class ClassroomsService {
  constructor(
    private http: Http,
    private storage: Storage
  ){}

  getClassrooms(teacherId: number, unityId: number){
    const url = "http://localhost:3000/api/v1/teacher_classrooms.json";
    const request = this.http.get(url, { params: { teacher_id: teacherId, unity_id: unityId } } );
    return request.map((response: Response) => {
      return {
        data: response.json(),
        unityId: unityId
      }
    });
  }
}