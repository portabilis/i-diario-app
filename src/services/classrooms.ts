import { Observable } from 'rxjs/Observable';
import { ConnectionService } from './connection';
import { ApiService } from './api';
import { Http, Response } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';

@Injectable()
export class ClassroomsService {
  constructor(
    private http: Http,
    private storage: Storage,
    private connection: ConnectionService,
    private api: ApiService
  ){}

  getOnlineClassrooms(teacherId: number, unityId: number){
    const request = this.http.get(this.api.getTeatcherClassroomsUrl(), { params: { teacher_id: teacherId, unity_id: unityId } } );
    return request.map((response: Response) => {
      return {
        data: response.json(),
        unityId: unityId
      }
    });
  }
  getOfflineClassrooms(unityId: number){
    return new Observable((observer) => {
      this.storage.get('classrooms').then((classrooms) => {
        classrooms.forEach((classroom) => {
          if(classroom.unityId == unityId){
            observer.next(classroom)
            observer.complete()
          }
        })
      })
    })
  }
}