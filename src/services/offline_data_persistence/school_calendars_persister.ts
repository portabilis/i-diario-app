import { SchoolCalendarsService } from './../school_calendars';
import { ExamRulesService } from './../exam_rules';
import { ClassroomsService } from './../classrooms';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { UnitiesService } from './../unities';
import { Injectable } from '@angular/core';

@Injectable()
export class SchoolCalendarsPersisterService{
  constructor(
    private classrooms: ClassroomsService,
    private unities: UnitiesService,
    private storage: Storage,
    private examRules: ExamRulesService,
    private schoolCalendars: SchoolCalendarsService
  ){}

  persist(user){
    return new Observable((observer) => {
      this.storage.get('unities').then((unities) => {
        let schoolCalendarObservables = []
        unities.forEach((unity) => {
          schoolCalendarObservables.push(this.schoolCalendars.getSchoolCalendar(unity.id))
        })

        Observable.forkJoin(schoolCalendarObservables).subscribe(
          (results) => {
            observer.next(this.storage.set('schoolCalendars', results))
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