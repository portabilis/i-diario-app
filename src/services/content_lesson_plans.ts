import { Response } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import { ApiService } from './api';
import { CustomHttp } from './custom_http';

@Injectable()
export class ContentLessonPlansService {
  constructor(
    private http: CustomHttp,
    private storage: Storage,
    private api: ApiService
  ){}

  getContentLessonPlans(teacherId: number){
    const request = this.http.get(this.api.getContentLessonPlansUrl(), { params: { teacher_id: teacherId } } );
    return request.map((response: Response) => {
      return response.json();
    });
  }
}