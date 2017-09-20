import { DailyFrequencyService } from './../daily_frequency';
import { ClassroomsService } from './../classrooms';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';

@Injectable()
export class DisciplineFrequenciesPersisterService{
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
      this.storage.get('examRules').then((examRule) => {
        let frequenciesObservables = []
        disciplines.forEach((disciplineList) => {
          disciplineList.data.forEach((discipline) => {
            const currentExamRule = examRule.filter((examRule) => {
              return examRule.classroomId == disciplineList.classroomId
            })

            if (currentExamRule[0].data.exam_rule.frequency_type == "2" || currentExamRule[0].data.exam_rule.allow_frequency_by_discipline) {
              frequenciesObservables.push(this.frequencies.getFrequencies(disciplineList.classroomId, discipline.id, user.teacher_id))
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

                if (frequencies) {
                  newFrequencies = newFrequencies.concat(frequencies.daily_frequencies)
                }

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
}