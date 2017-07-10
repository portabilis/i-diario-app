import { User } from './../../data/user.interface';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { LessonPlansService } from './../lesson_plans';
import { Injectable } from '@angular/core';


@Injectable()

export class LessonPlansPersisterService{
  constructor(
    private lesson_plans: LessonPlansService,
    private storage: Storage
  ){}

  persist(user: User){
    return new Observable((observer) => {
      this.lesson_plans.getLessonPlans(user.teacher_id).subscribe(
        (lesson_plans) => {
          observer.next(this.storage.set('lesson_plans', lesson_plans))
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