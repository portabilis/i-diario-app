import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import { ServerService } from './server';

@Injectable()
export class StudentsService {
  constructor(
    private http: Http,
    private storage: Storage,
    private server: ServerService
  ){}

  getStudents(classroomId: number, disciplineId: number){
    const request = this.http.get(this.server.getClassroomStudentsUrl(), { params: { classroom_id: classroomId, discipline_id: disciplineId } } );
    return request.map((response: Response) => {
      return {
        data: response.json(),
        classroomId: classroomId,
        disciplineId: disciplineId
      };
    });
  }

  getOfflineStudents(classroomId, disciplineId){
     return new Observable((observer) => {
      this.storage.get('students').then((students) => {
        students.forEach((student) => {
          if(student.classroomId == classroomId && student.disciplineId == disciplineId){
            observer.next(student)
            observer.complete()
          }
        })
      })
    })
  }
}