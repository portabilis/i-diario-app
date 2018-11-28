import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { ConnectionService } from './connection';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import 'rxjs/add/observable/of';
import { ApiService } from './api';
import { CustomHttp } from './custom_http';

@Injectable()
export class DailyFrequencyStudentService {
  constructor(
    private http: CustomHttp,
    private storage: Storage,
    private api: ApiService,
    private connection: ConnectionService
  ){}

  private trigger = undefined;

  obsQueue(frequency) {
    if (!this.trigger || this.trigger.isStopped) {
      this.trigger = new Subject();
      return this.createObservable(this.trigger, frequency);
    } else {
      var lastTrigger = this.trigger;
      var newTrigger = this.trigger = new Subject();
      return lastTrigger.last().mergeMap(() => {
        return this.createObservable(newTrigger, frequency);
      });
    }
  }


  createObservable(trigger, frequency) {
    return this._updateFrequency(frequency).finally(() => {
      trigger.next();
      trigger.complete();
    });
  }


  updateFrequency(frequency){
    return this.obsQueue(frequency);
  }

  private _updateFrequency(frequency){
    return new Observable((observer) => {

      Observable.forkJoin(
        Observable.fromPromise(this.storage.get('dailyFrequencyStudentsToSync')),
        Observable.fromPromise(this.storage.get('frequencies'))
      ).subscribe(
        (results) => {
          let existingDailyFrequencyStudentsToSync = results[0] || []
          let frequencies = results[1] || []

          const dailyFrequencyStudentsToSync = existingDailyFrequencyStudentsToSync.concat(frequency)
          this.storage.set('dailyFrequencyStudentsToSync', dailyFrequencyStudentsToSync)
          this.updateLocalFrequency(frequency, frequencies)

          // Colocado timeout porque aparentemente o get sendo executado poucos ms após o set
          // está retornando os dados desatualizados
          setTimeout(function(){
            observer.next([frequency]);
            observer.complete();
          }, 100);

        })
    })

  }

  private updateLocalFrequency(frequency, localFrequencies){
    localFrequencies.daily_frequencies.forEach((localFrequency, localFrequencyIndex) => {
      if (localFrequency.classroom_id == frequency.classroomId &&
          localFrequency.frequency_date == frequency.frequencyDate &&
          localFrequency.discipline_id == frequency.disciplineId &&
          localFrequency.class_number == frequency.classNumber) {

        let newLocalFrequency = this.clone(localFrequency)

        newLocalFrequency.students.forEach(student => {
          if(student.student.id == frequency.studentId){
            student.present = frequency.present
          }
        });

        localFrequencies.daily_frequencies[localFrequencyIndex] = newLocalFrequency

        this.storage.set('frequencies', localFrequencies )
      }
    });
  }

  private clone(object){
    return JSON.parse(JSON.stringify(object))
  }
}