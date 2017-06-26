import { Observable } from 'rxjs/Observable';
import { ConnectionService } from './connection';
import { ServerService } from './server';
import { Http, Response } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';

@Injectable()
export class DailyFrequencyService {
  constructor(
    private http: Http,
    private storage: Storage,
    private connection: ConnectionService,
    private server: ServerService
  ){}

  getStudents(userId, teacherId, unityId, classroomId, frequencyDate, disciplineId, classNumbers){
    if(this.connection.isOnline){
      return this.getOnlineStudents(userId, teacherId, unityId, classroomId, frequencyDate, disciplineId, classNumbers)
    }else{
      return this.getOfflineStudents(userId, teacherId, unityId, classroomId, frequencyDate, disciplineId, classNumbers)
    }
  }

  getOnlineStudents(userId, teacherId, unityId, classroomId, frequencyDate, disciplineId, classNumbers){
    const request = this.http.post(this.server.getDailyFrequencyUrl(),
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

   getOfflineStudents(userId, teacherId, unityId, classroomId, frequencyDate, disciplineId, classNumbers){
    const splitedClassNumbers = classNumbers.split(",")

    return new Observable((observer) => {
      this.storage.get('frequencies').then((frequencies) => {

        let filteredFrequencies = []
        frequencies.forEach((frequency) => {
          const filteredItem = frequency.daily_frequencies.filter((dailyFrequency) => {
            return (dailyFrequency.classroom_id == classroomId &&
                    dailyFrequency.discipline_id == disciplineId &&
                    splitedClassNumbers.includes(dailyFrequency.class_number.toString()) &&
                    dailyFrequency.frequency_date == frequencyDate)
          })

          if(filteredItem.length > 0){
            filteredFrequencies.push(filteredItem)
          }

        });

        observer.next({daily_frequencies: filteredFrequencies[0]})
        observer.complete()
      })
    })
  }

  private createOfflineFrequency(userId, teacherId, unityId, classroomId, frequencyDate, disciplineId, classNumbers, frequencies){

    let dailyFrequency = []
    const dailyFrequencies = classNumbers.map((classNumber) => {
      return {
        class_number: classNumber,
        classroom_id: classroomId,
        discipline_id: disciplineId,
        id: null,
        students: null,
        unity_id: unityId
      }
    })

    return {
      classroomId: classroomId,
      disciplineId: disciplineId,
      teacherId: teacherId,
      data: {
        daily_frequencies: dailyFrequencies
      }
    }
  }

  getFrequencies(classroomId, disciplineId,teacherId){
    const request = this.http.get(this.server.getDailyFrequencyUrl(),
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