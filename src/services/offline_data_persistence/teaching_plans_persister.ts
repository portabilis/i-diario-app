import { User } from './../../data/user.interface';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { TeachingPlansService } from './../teaching_plans';
import { Injectable } from '@angular/core';


@Injectable()

export class TeachingPlansPersisterService{
  constructor(
    private teachingPlans: TeachingPlansService,
    private storage: Storage
  ){}

  persist(user: User){
    return new Observable((observer) => {
      this.teachingPlans.getTeachingPlans(user.teacher_id).subscribe(
        (teachingPlans) => {
          observer.next(this.storage.set('teachingPlans', teachingPlans))
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