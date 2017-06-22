import { Observable } from 'rxjs/Observable';
import { ConnectionService } from './connection';
import { Http, Response } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';

@Injectable()
export class DailyFrequencyService {
  constructor(
    private http: Http,
    private storage: Storage,
    private connection: ConnectionService
  ){}

  getStudents(userId, teacherId, unityId, classroomId, frequencyDate, disciplineId, classNumbers){
    if(this.connection.isOnline){
      return this.getOnlineStudents(userId, teacherId, unityId, classroomId, frequencyDate, disciplineId, classNumbers)
    }else{
      return this.getOfflineStudents(classroomId, frequencyDate, disciplineId, classNumbers)
    }
  }

  getOnlineStudents(userId, teacherId, unityId, classroomId, frequencyDate, disciplineId, classNumbers){
    const url = "http://localhost:3000/api/v1/diario-de-frequencia.json";
    const request = this.http.post(url,
      {
        user_id: userId,
        teacher_id: teacherId,
        unity_id: unityId,
        classroom_id: classroomId,
        frequency_date: frequencyDate,
        discipline_id: disciplineId,
        class_numbers: classNumbers
      }
    );
    return request.map((response: Response) => {
      return response.json();
    });
  }

   getOfflineStudents(classroomId, frequencyDate, disciplineId, classNumbers){
    const splitedClassNumbers = classNumbers.split(",")

    return new Observable((observer) => {
      this.storage.get('frequencies').then((frequencies) => {
        console.log(frequencies)
        let filteredFrequencies = frequencies.filter((frequency) => {
          return (frequency.classroomId == classroomId &&
                  frequency.disciplineId == disciplineId)
        })
        filteredFrequencies[0].data.daily_frequencies = filteredFrequencies[0].data.daily_frequencies.filter((daily_frequency) => {
          return (splitedClassNumbers.includes(daily_frequency.class_number.toString()) &&
                  daily_frequency.frequency_date == frequencyDate)
        })
        observer.next(filteredFrequencies[0].data)
        observer.complete()
      })
    })
  }

  getFrequencies(classroomId, disciplineId,teacherId){
    const url = "http://localhost:3000/api/v1/daily_frequencies.json";
    const request = this.http.get(url,
      {
        params: {
          classroom_id: classroomId,
          discipline_id: disciplineId,
          teacher_id: teacherId
        }
      }
    );
    return request.map((response: Response) => {
      return {
        data: response.json(),
        classroomId: classroomId,
        disciplineId: disciplineId,
        teacherId: teacherId
      };
    });
  }

}