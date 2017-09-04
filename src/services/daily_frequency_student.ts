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
    this.storage.get('dailyFrequencyStudentsToSync').then((frequenciesToSync) => {
      this.storage.get('frequencies').then((frequencies) => {
        let existingDailyFrequencyStudentsToSync = frequenciesToSync || []
        const dailyFrequencyStudentsToSync = existingDailyFrequencyStudentsToSync.concat(frequency)
        this.storage.set('dailyFrequencyStudentsToSync', dailyFrequencyStudentsToSync)
        this.updateLocalFrequency(frequency, frequencies)
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