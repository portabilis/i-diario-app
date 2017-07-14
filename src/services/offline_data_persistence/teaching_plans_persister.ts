import { User } from './../../data/user.interface';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { TeachingPlansService } from './../teaching_plans';
import { Injectable } from '@angular/core';


@Injectable()

export class TeachingPlansPersisterService{
  constructor(
    private teaching_plans: TeachingPlansService,
    private storage: Storage
  ){}

  persist(user: User){
    return new Observable((observer) => {
      this.teaching_plans.getTeachingPlans(user.teacher_id).subscribe(
        (teaching_plans) => {
          observer.next(this.storage.set('teaching_plans', teaching_plans))
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