import { Http, Response } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';

@Injectable()
export class StudentsService {
  constructor(
    private http: Http,
    private storage: Storage
  ){}

  getStudents(classroomId: number, disciplineId: number){
    const url = "http://localhost:3000/api/v1/classroom_students.json";
    const request = this.http.get(url, { params: { classroom_id: classroomId, discipline_id: disciplineId } } );
    return request.map((response: Response) => {
      return {
        data: response.json(),
        classroomId: classroomId,
        disciplineId: disciplineId
      };
    });
  }
}