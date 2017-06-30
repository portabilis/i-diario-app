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

    if(disciplineId){
      return this.getOfflineStudentsDisciplineAbsence(classroomId, disciplineId, splitedClassNumbers, frequencyDate)
    }else{
      return this.getOfflineStudentsGlobalAbsence(classroomId, frequencyDate)
    }
  }

  private getOfflineStudentsGlobalAbsence(classroomId, frequencyDate){
    return new Observable((observer) => {
      this.storage.get('frequencies').then((frequencies) => {

        let filteredDailyFrequencies = frequencies.daily_frequencies.filter((dailyFrequency) => {
          return (dailyFrequency.classroom_id == classroomId &&
                  dailyFrequency.frequency_date == frequencyDate &&
                  dailyFrequency.discipline_id == null &&
                  dailyFrequency.class_number == null)
        })

        if(filteredDailyFrequencies.length == 0){
          let filteredFrequencies = frequencies.daily_frequencies.filter((dailyFrequency) => {
          return (dailyFrequency.classroom_id == classroomId &&
                  dailyFrequency.discipline_id == null &&
                  dailyFrequency.class_number == null)
        })

          const lastFrequency = this.getLastFrequency(filteredFrequencies)
          const newFrequencies = this.createOfflineGlobalFrequencies(filteredDailyFrequencies[0], frequencyDate, lastFrequency)
          filteredDailyFrequencies = filteredDailyFrequencies.concat(newFrequencies)
        }

        observer.next({daily_frequency: filteredDailyFrequencies[0]})
        observer.complete()
      });
    })
  }

  private createOfflineGlobalFrequencies(frequency, frequencyDate, frequencyToCopy){
    let frequencyCopy = this.clone(frequencyToCopy)
    frequencyCopy.frequency_date = frequencyDate
    frequencyCopy = this.setNullToIds(frequencyCopy)
    return frequencyCopy
  }

  private getOfflineStudentsDisciplineAbsence(classroomId, disciplineId, splitedClassNumbers, frequencyDate){
    return new Observable((observer) => {
      this.storage.get('frequencies').then((frequencies) => {

        let filteredDailyFrequencies = frequencies.daily_frequencies.filter((dailyFrequency) => {
          return (dailyFrequency.classroom_id == classroomId &&
                  dailyFrequency.discipline_id == disciplineId &&
                  splitedClassNumbers.includes(dailyFrequency.class_number.toString()) &&
                  dailyFrequency.frequency_date == frequencyDate)
        })

        if(filteredDailyFrequencies.length == 0){
          let filteredFrequencies = frequencies.daily_frequencies.filter((dailyFrequency) => {
            return (dailyFrequency.classroom_id == classroomId &&
                    dailyFrequency.discipline_id == disciplineId)
          })

          const lastFrequency = this.getLastFrequency(filteredFrequencies)
          const newFrequencies = this.createOfflineFrequenciesWithDate(splitedClassNumbers, frequencyDate, lastFrequency)

          filteredDailyFrequencies = filteredDailyFrequencies.concat(newFrequencies)
          this.saveNewOfflineFrequencies(frequencies, newFrequencies)
        }
        else if(filteredDailyFrequencies.length < splitedClassNumbers.length){

          const frequencyClasses = filteredDailyFrequencies.map((frequency) => {
            return frequency.class_number.toString()
          })

          const missingClasses = splitedClassNumbers.filter((classNumber) => {
            return !frequencyClasses.includes(classNumber)
          })

          const newFrequencies = this.createOfflineFrequenciesWithClasses(missingClasses, filteredDailyFrequencies[0])
          filteredDailyFrequencies = filteredDailyFrequencies.concat(newFrequencies)

          this.saveNewOfflineFrequencies(frequencies, newFrequencies)
        }

        observer.next({daily_frequencies: filteredDailyFrequencies})
        observer.complete()
      })
    })
  }

  private saveNewOfflineFrequencies(existingFrequencies, newFrequencies){
    const offlineFrequencies = existingFrequencies.daily_frequencies.concat(newFrequencies)
    this.storage.set('frequencies', { daily_frequencies: offlineFrequencies })
  }

  private getLastFrequency(frequencies){
    const filteredFrequencies = frequencies.sort((a,b) => {
      if (a.frequency_date < b.frequency_date) {
        return 1;
      }
      if (a.frequency_date > b.frequency_date) {
        return -1;
      }
      return 0;
    })

    return filteredFrequencies[0]
  }

  private createOfflineFrequenciesWithClasses(missingClasses, frequencyToCopy){

    const missingDailyFrequencies = missingClasses.map((classNumber) => {
      let frequencyCopy = this.clone(frequencyToCopy)
      frequencyCopy.class_number = parseInt(classNumber)
      frequencyCopy = this.setNullToIds(frequencyCopy)
      return frequencyCopy
    })

    return missingDailyFrequencies
  }

   private createOfflineFrequenciesWithDate(missingClasses, frequencyDate, frequencyToCopy){

    const missingDailyFrequencies = missingClasses.map((classNumber) => {
      let frequencyCopy = this.clone(frequencyToCopy)
      frequencyCopy.class_number = parseInt(classNumber)
      frequencyCopy.frequency_date = frequencyDate
      frequencyCopy = this.setNullToIds(frequencyCopy)
      return frequencyCopy
    })

    return missingDailyFrequencies
  }

  private setNullToIds(frequency){
    frequency.id = null
    frequency.students.forEach((element) => {
      element.id = null
      element.present = true
    })
    return frequency
  }

  private clone(object){
    return JSON.parse(JSON.stringify(object))
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