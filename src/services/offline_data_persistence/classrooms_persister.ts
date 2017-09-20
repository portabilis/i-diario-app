import { DisciplinesPersisterService } from './disciplines_persister';
import { ExamRulesPersisterService } from './exam_rules_persister';
import { ClassroomsService } from './../classrooms';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';

@Injectable()
export class ClassroomsPersisterService{
  constructor(
    private classrooms: ClassroomsService,
    private examRulesPersister: ExamRulesPersisterService,
    private disciplinesPersister: DisciplinesPersisterService,
    private storage: Storage
  ){}
  persist(user, unities){
    return new Observable((observer) => {
      let classroomsObservables = []
      unities.forEach((unity) => {
        classroomsObservables.push(this.classrooms.getOnlineClassrooms(user.teacher_id, unity.id))
      })

      Observable.forkJoin(classroomsObservables).subscribe(
        (classrooms) => {
          this.storage.set('classrooms', classrooms)

          Observable.concat(
            this.examRulesPersister.persist(user, classrooms),
            this.disciplinesPersister.persist(user, classrooms)
          ).subscribe(
            (result) => {
            },
            (error) => {
              observer.error(error);
            },
            () => {
              observer.complete()
            }
          )
        }
      )
    })
  }
}