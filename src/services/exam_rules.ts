import { Observable } from 'rxjs/Observable'
import { ConnectionService } from './connection'
import { ApiService } from './api'
import { Http, Response } from '@angular/http'
import { Storage } from '@ionic/storage'
import { Injectable } from '@angular/core'
import 'rxjs/Rx'

@Injectable()
export class ExamRulesService {
  constructor(
    private http: Http,
    private storage: Storage,
    private connection: ConnectionService,
    private api: ApiService
  ){}

  getOnlineExamRules(teacherId: number, classroomId: number){
    const request = this.http.get(this.api.getExamRulesUrl(), { params: { teacher_id: teacherId, classroom_id: classroomId } } )
    return request.map((response: Response) => {
      return {
        data: response.json(),
        classroomId: classroomId
      }
    })
  }

  getOfflineExamRules(classroomId: number){
    return new Observable((observer) => {
      this.storage.get('examRules').then((examRules) => {
        if (!examRules){
          observer.complete();
          return;
        }

        examRules.forEach((examRule) => {
          if(examRule.classroomId == classroomId){
            observer.next(examRule)
            observer.complete()
          }
        })
      })
    })
  }
}
