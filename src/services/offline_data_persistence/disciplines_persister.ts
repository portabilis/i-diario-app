import { DisciplinesService } from './../disciplines';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';

@Injectable()
export class DisciplinesPersisterService{
  constructor(
    private storage: Storage,
    private disciplines: DisciplinesService
  ){}
  persist(user){
    return new Observable((observer) => {
      this.storage.get('classrooms').then((classrooms) => {
        let classroomObservables = []
        classrooms.forEach((classroomList) => {
          classroomList.data.forEach((classroom) => {
            classroomObservables.push(this.disciplines.getDisciplines(user.teacher_id, classroom.id))
          })
        })
        Observable.forkJoin(classroomObservables).subscribe(
          (result) => {
            observer.next(this.storage.set('disciplines', result))
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