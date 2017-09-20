import { DailyFrequencyService } from './../daily_frequency';
import { ClassroomsService } from './../classrooms';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';

@Injectable()
export class GlobalFrequenciesPersisterService{
  constructor(
    private classrooms: ClassroomsService,
    private storage: Storage,
    private frequencies: DailyFrequencyService
  ){}

  persist(user, classrooms){
    return new Observable((observer) => {
      this.storage.get('examRules').then((examRule) => {
        let frequenciesObservables = []
        classrooms.forEach((classroomList) => {
          classroomList.data.forEach((classroom) => {
            let currentExamRule = examRule.filter((examRule) => {
              return examRule.classroomId == classroom.id
            })
            if (currentExamRule[0].data.exam_rule.frequency_type == "1") {
              frequenciesObservables.push(this.frequencies.getFrequencies(classroom.id, null, user.teacher_id))
            }
          })
        })

        Observable.forkJoin(frequenciesObservables).subscribe(
          (results: any) => {
            this.storage.get('frequencies').then((frequencies) => {
              let notEmptyResults = results.filter(this.notEmptyDailyFrequencies)
              notEmptyResults = notEmptyResults.map((result: any) => {
                return result.data.daily_frequencies
              })
              if(notEmptyResults.length > 0){
                let newFrequencies = notEmptyResults.reduce((a:any,b:any) => {
                  return a.concat(b)
                })

                this.storage.set('frequencies', { daily_frequencies: newFrequencies })
                observer.next()
              }
            })
          },
          (error) => {
            observer.error(error);
          },
          () => {
            observer.complete()
          }
        )
      })
    })
  }

  private notEmptyDailyFrequencies(dailyFrequencies){
    return dailyFrequencies.data.daily_frequencies.length > 0
  }
}