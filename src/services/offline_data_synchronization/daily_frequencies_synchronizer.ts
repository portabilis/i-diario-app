import { ApiService } from './../api';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { CustomHttp } from '../custom_http';

@Injectable()
export class DailyFrequenciesSynchronizer {
  constructor(
    private http: CustomHttp,
    private api: ApiService,
    private storage: Storage
  ){}

  public sync(dailyFrequencies){
    return new Observable((observer) => {
      if(dailyFrequencies){
        let dailyFrequencyObservables = []
        dailyFrequencies.forEach(dailyFrequency => {
          const request = this.mountDailyFrequencyPostRequest(dailyFrequency)
          dailyFrequencyObservables.push(request)
        })

        Observable.concat(...dailyFrequencyObservables).subscribe(
          (result) => {
            observer.next(result)
          },
          (error) => {
            observer.error(error)
          },
          () => {
            observer.complete()
          }
        )
      }else{
        observer.complete()
      }
    })
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