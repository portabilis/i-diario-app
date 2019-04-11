import { ApiService } from './../api';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { CustomHttp } from '../custom_http';
import { AuthService } from '../auth';

@Injectable()
export class DailyFrequenciesSynchronizer {
  constructor(
    private http: CustomHttp,
    private api: ApiService,
    private storage: Storage,
    private auth: AuthService
  ){}

  public sync(dailyFrequencies){
    return new Observable((observer) => {
      if(dailyFrequencies){
        this.auth.currentUser().then((user) => {
          let dailyFrequencyObservables = []
          dailyFrequencies.forEach(dailyFrequency => {
            const request = this.mountDailyFrequencyPostRequest(dailyFrequency, user.teacher_id)
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
        });
      }else{
        observer.complete()
      }
    })
  }

  private mountDailyFrequencyPostRequest(dailyFrequency, teacherId){
    return this.http.post(this.api.getDailyFrequencyUrl(), {
        unity_id: dailyFrequency.unity_id,
        classroom_id: dailyFrequency.classroom_id,
        frequency_date: dailyFrequency.frequency_date,
        discipline_id: dailyFrequency.discipline_id,
        class_number: dailyFrequency.class_number,
        teacher_id: teacherId
      }).map((response: Response) => {
        return response.json();
      });

  }
}
