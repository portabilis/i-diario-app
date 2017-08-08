import { SchoolCalendarsService } from './../school_calendars';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';

@Injectable()
export class SchoolCalendarsPersisterService{
  constructor(
    private storage: Storage,
    private schoolCalendars: SchoolCalendarsService
  ){}

  persist(user, unities){
    return new Observable((observer) => {
      let schoolCalendarObservables = []
      unities.forEach((unity) => {
        schoolCalendarObservables.push(this.schoolCalendars.getOnlineSchoolCalendar(unity.id))
      })

      Observable.forkJoin(schoolCalendarObservables).subscribe(
        (results) => {
          observer.next(this.storage.set('schoolCalendars', results))
        },
        (error) => {
          observer.error(error);
          console.log(error)
        },
        () => {
          observer.complete()
        }
      )
    })
  }
}