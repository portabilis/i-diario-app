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

  private notEmptyDailyFrequencies(dailyFrequencies){
    return dailyFrequencies.data.daily_frequencies.length > 0
  }

  persist(user, disciplines){
   return new Observable((observer) => {
      let frequenciesObservables = []
      disciplines.forEach((disciplineList) => {
        disciplineList.data.forEach((discipline) => {
          frequenciesObservables.push(this.frequencies.getFrequencies(disciplineList.classroomId, discipline.id, user.teacher_id))
        });
      })

      Observable.forkJoin(frequenciesObservables).subscribe(
        (results: any) => {

          let notEmptyResults = results.filter(this.notEmptyDailyFrequencies)
          notEmptyResults = notEmptyResults.map((result: any) => {
            return result.data.daily_frequencies
          })
          if(notEmptyResults.length > 0){
            const mergedResults = notEmptyResults.reduce((a:any,b:any) => {
              return a.concat(b)
            })
            observer.next(this.storage.set('frequencies', { daily_frequencies: mergedResults }))
          }
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