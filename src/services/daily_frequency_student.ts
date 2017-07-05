import { Observable } from 'rxjs/Observable';
import { ConnectionService } from './connection';
import { Http, Response } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import { ApiService } from './api';

@Injectable()
export class DailyFrequencyStudentService {
  constructor(
    private http: Http,
    private storage: Storage,
    private api: ApiService,
    private connection: ConnectionService
  ){}

  updateFrequency(frequency){
    if(this.connection.isOnline){
      return this.updateOnlineFrequency(frequency)
    }else{
      return this.updateOfflineFrequency(frequency)
    }
  }

  private updateOnlineFrequency(frequency){
    const request = this.http.put(this.api.getDailyFrequencyStudentsUrl(frequency.id),
      {
        present: frequency.present,
        user_id: frequency.userId
      }
    );
    return request.map((response: Response) => {
      return response.json();
    });
  }

  private updateOfflineFrequency(frequency){
    return new Observable((observer) => {
      this.storage.get('dailyFrequencyStudentsToSync').then((frequenciesToSync) => {
        this.storage.get('frequencies').then((localFrequencies) => {
          let existingDailyFrequencyStudentsToSync = frequenciesToSync || []
          const dailyFrequencyStudentsToSync = existingDailyFrequencyStudentsToSync.concat(frequency)
          this.storage.set('dailyFrequencyStudentsToSync', dailyFrequencyStudentsToSync)
          this.updateLocalFrequency(frequency, localFrequencies)
          observer.next()
          observer.complete()
        })
      })
    })
  }

  private updateLocalFrequency(frequency, localFrequencies){
    localFrequencies.daily_frequencies.forEach((localFrequency, localFrequencyIndex) => {
      if(localFrequency.classroom_id == frequency.classroomId &&
         localFrequency.frequency_date == frequency.frequencyDate &&
         localFrequency.discipline_id == frequency.disciplineId &&
         localFrequency.class_number == frequency.classNumber){

        const localFrequencyFoundIndex = localFrequencyIndex

        localFrequency.students.forEach(student => {
          if(student.student.id == frequency.studentId){
            student.present = frequency.present
          }
        });

        localFrequencies.daily_frequencies[localFrequencyFoundIndex] = localFrequency

        this.storage.set('frequencies', localFrequencies )
      }
    });
  }
}