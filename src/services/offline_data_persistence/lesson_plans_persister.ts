import { User } from './../../data/user.interface';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { LessonPlansService } from './../lesson_plans';
import { Injectable } from '@angular/core';


@Injectable()

export class LessonPlansPersisterService{
  constructor(
    private lessonPlans: LessonPlansService,
    private storage: Storage
  ){}

  persist(user: User){
    return new Observable((observer) => {
      this.lessonPlans.getLessonPlans(user.teacher_id).subscribe(
        (lessonPlans) => {
          observer.next(this.storage.set('lessonPlans', lessonPlans))
        },
        (error) => {
          observer.error(error);
        },
        () => {
          observer.complete()
        }
      )
    })
  }
}