import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import { ApiService } from './api';
import { CustomHttp } from './custom_http';

@Injectable()
export class StudentsService {
  constructor(
    private http: CustomHttp,
    private storage: Storage,
    private api: ApiService
  ){}

  getStudents(classroomId: number, disciplineId: number){
    const request = this.http.get(this.api.getClassroomStudentsUrl(), { params: { classroom_id: classroomId, discipline_id: disciplineId } } );
    return request.map((response: Response) => {
      return {
        data: response.json(),
        classroomId: classroomId,
        disciplineId: disciplineId
      };
    });
  }

  getOfflineGlobalStudents(classroomId){
     return new Observable((observer) => {
      this.storage.get('students').then((students) => {
        if (!students){
          observer.complete();
          return;
        }

        students.forEach((student) => {
          if(student.classroomId == classroomId){
            observer.next(student)
          }
        })
        observer.complete()
      })
    })
  }

   getOfflineDisciplineStudents(classroomId, disciplineId){
     return new Observable((observer) => {
      this.storage.get('students').then((students) => {
        if (!students){
          observer.complete();
          return;
        }

        students.forEach((student) => {
          if(student.classroomId == classroomId && student.disciplineId == disciplineId){
            observer.next(student)
          }
        })
        observer.complete()
      })
    })
  }
}
