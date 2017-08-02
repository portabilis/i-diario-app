import { SchoolCalendarsPersisterService } from './school_calendars_persister';
import { ClassroomsPersisterService } from './classrooms_persister';
import { User } from './../../data/user.interface';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { UnitiesService } from './../unities';
import { Injectable } from '@angular/core';


@Injectable()

export class UnitiesPersisterService{
  constructor(
    private unities: UnitiesService,
    private classroomsPersister: ClassroomsPersisterService,
    private schoolCalendarsPersister: SchoolCalendarsPersisterService,
    private storage: Storage
  ){}

  persist(user: User){
    return new Observable((observer) => {
      this.unities.getUnities(user.teacher_id).subscribe(
        (unities) => {
          this.storage.set('unities', unities)

          Observable.forkJoin(
            this.classroomsPersister.persist(user, unities),
            this.schoolCalendarsPersister.persist(user, unities)
          ).subscribe(
            (result) => {
            },
            (error) => {
            },
            () => {
              observer.complete()
            }
          )
        },
        (error) => {
          console.log(error)
        }
      )
    })
  }
}