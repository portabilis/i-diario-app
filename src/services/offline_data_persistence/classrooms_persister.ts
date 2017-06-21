import { ClassroomsService } from './../classrooms';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';

@Injectable()
export class ClassroomsPersisterService{
  constructor(
    private classrooms: ClassroomsService,
    private storage: Storage
  ){}
  persist(user){
   return new Observable((observer) => {
    this.storage.get('unities').then((unities) => {
      let classroomsObservables = []
      unities.forEach((unity) => {
        classroomsObservables.push(this.classrooms.getClassrooms(user.teacher_id, unity.id))
      })

      Observable.forkJoin(classroomsObservables).subscribe(
        (results) => {
          observer.next(this.storage.set('classrooms', results))
        },
        (error) => {
          console.log(error)
        },
        () => {
          observer.complete()
        }
      )
    })
   })
  }
}