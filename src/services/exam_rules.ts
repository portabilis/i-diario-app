import { Http, Response } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';

@Injectable()
export class ExamRulesService {
  constructor(
    private http: Http,
    private storage: Storage
  ){}

  getExamRules(teacherId: string, classroomId: string){
    const url = "http://localhost:3000/api/v1/exam_rules.json";
    const request = this.http.get(url, { params: { teacher_id: teacherId, classroom_id: classroomId } } );
    return request.map((response: Response) => {
      return response.json();
    }).toPromise();
  }
}