import { StudentsService } from './../students';
import { ClassroomsService } from './../classrooms';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';

@Injectable()
export class StudentsPersisterService{
  constructor(
    private classrooms: ClassroomsService,
    private storage: Storage,
    private students: StudentsService
  ){}

  persist(user, disciplines){
   return new Observable((observer) => {
      let studentsObservables = []
      disciplines.forEach((disciplineList) => {
        disciplineList.data.forEach((discipline) => {
          studentsObservables.push(this.students.getStudents(disciplineList.classroomId, discipline.id, user.teacher_id))
        });
      })

      Observable.forkJoin(studentsObservables).subscribe(
        (results: any) => {
          this.storage.set('students', results)
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