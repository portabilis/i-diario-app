import { ExamRulesService } from './../exam_rules';
import { ClassroomsService } from './../classrooms';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { UnitiesService } from './../unities';
import { Injectable } from '@angular/core';

@Injectable()
export class ExamRulesPersisterService{
  constructor(
    private classrooms: ClassroomsService,
    private unities: UnitiesService,
    private storage: Storage,
    private examRules: ExamRulesService
  ){}

  persist(user, classrooms){
    return new Observable((observer) => {
      let examRulesObservables = []
      classrooms.forEach(classroomList => {
        classroomList.data.forEach((classroom) => {
          examRulesObservables.push(this.examRules.getExamRules(user.teacher_id, classroom.id))
        })
      })
      Observable.forkJoin(examRulesObservables).subscribe(
        (results) => {
          observer.next(this.storage.set('examRules', results))
        },
        (error) => {
          console.log(error)
        },
        () => {
          observer.complete()
        }
      )
    })
  }
}
