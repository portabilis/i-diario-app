import { DailyFrequencyService } from './../daily_frequency';
import { ClassroomsService } from './../classrooms';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';

@Injectable()
export class FrequenciesPersisterService{
  constructor(
    private classrooms: ClassroomsService,
    private storage: Storage,
    private frequencies: DailyFrequencyService
  ){}
  persist(user){
   return new Observable((observer) => {
    this.storage.get('disciplines').then((disciplines) => {
      let frequenciesObservables = []
      disciplines.forEach((disciplineList) => {
        disciplineList.data.forEach((discipline) => {
          frequenciesObservables.push(this.frequencies.getFrequencies(disciplineList.classroomId, discipline.id, user.teacher_id))
        });
      })

      Observable.forkJoin(frequenciesObservables).subscribe(
        (results) => {
          observer.next(this.storage.set('frequencies', results))
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