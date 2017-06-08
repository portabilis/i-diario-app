import { Observable } from 'rxjs/Observable';
import { ConnectionService } from './connection';
import { Http, Response } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';

@Injectable()
export class DisciplinesService {
  constructor(
    private http: Http,
    private storage: Storage,
    private connection: ConnectionService
  ){}

  getDisciplines(teacherId: number, classroomId: number){
    if(this.connection.isOnline){
      return this.getOnlineDisciplines(teacherId, classroomId)
    }else{
      return this.getOfflineDisciplines(classroomId)
    }
  }
  getOnlineDisciplines(teacherId: number, classroomId: number){
    const url = "http://***REMOVED***/api/v1/teacher_disciplines.json";
    const request = this.http.get(url, { params: { teacher_id: teacherId, classroom_id: classroomId } } );
    return request.map((response: Response) => {
      return {
        data: response.json(),
        classroomId: classroomId
      };
    });
  }
  getOfflineDisciplines(classroomId: number){
    return new Observable((observer) => {
      this.storage.get('disciplines').then((disciplines) => {
        disciplines.forEach((discipline) => {
          if(discipline.classroomId == classroomId){
            observer.next(discipline)
            observer.complete()
          }
        })
      })
    })
  }
}