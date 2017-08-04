import { ApiService } from './../api';
import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';

@Injectable()
export class DailyFrequenciesSynchronizer {
  constructor(
    private http: Http,
    private api: ApiService,
    private storage: Storage
  ){

  }

  public sync(dailyFrequencies){
    return new Observable((observer) => {

      let dailyFrequencyObservables = []
      dailyFrequencies.forEach(dailyFrequency => {
        const request = this.mountDailyFrequencyPostRequest(dailyFrequency)

        dailyFrequencyObservables.push(request)
      })

      Observable.concat(...dailyFrequencyObservables).subscribe(
        (result) => {
          observer.next(result)
          this.removeSyncDailyFrequency(result, dailyFrequencies)
        },
        (error) => {
          observer.next(error)
        },
        () => {
          observer.complete()
        }
      )
    })
  }

  private removeSyncDailyFrequency(frequencyToRemove, pendingDailyFrequencies){
    let newPendingDailyFrequencies = []

    pendingDailyFrequencies.forEach((pendingDailyFrequency) => {
      if (frequencyToRemove.daily_frequency.classroom_id == pendingDailyFrequency.classroom_id &&
         frequencyToRemove.daily_frequency.frequency_date == pendingDailyFrequency.frequency_date &&
         frequencyToRemove.daily_frequency.discipline_id == pendingDailyFrequency.discipline_id &&
         frequencyToRemove.daily_frequency.class_number == pendingDailyFrequency.class_number){
        newPendingDailyFrequencies.push(pendingDailyFrequency)
      }
    })

    this.storage.set('dailyFrequenciesToSync', newPendingDailyFrequencies)
  }

  private mountDailyFrequencyPostRequest(dailyFrequency){
    return this.http.post(this.api.getDailyFrequencyUrl(), {
      unity_id: dailyFrequency.unity_id,
      classroom_id: dailyFrequency.classroom_id,
      frequency_date: dailyFrequency.frequency_date,
      discipline_id: dailyFrequency.discipline_id,
      class_number: dailyFrequency.class_number
    }).map((response: Response) => {
      return response.json();
    });
  }
}