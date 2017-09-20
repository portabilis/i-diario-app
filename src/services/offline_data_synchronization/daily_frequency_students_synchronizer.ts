import { ApiService } from './../api';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';

@Injectable()
export class DailyFrequencyStudentsSynchronizer {
  constructor(
    private http: Http,
    private api: ApiService,
    private storage: Storage
  ){

  }

  public sync(dailyFrequencyStudents){
    return new Observable((observer) => {
      if(dailyFrequencyStudents){
        let dailyFrequencyStudentObservables = []
        dailyFrequencyStudents.forEach(dailyFrequencyStudent => {
          const request = this.http.post(this.api.getDailyFrequencyStudentsUpdateOrCreateUrl(),
            {
              present: dailyFrequencyStudent.present,
              user_id: dailyFrequencyStudent.userId,
              classroom_id: dailyFrequencyStudent.classroomId,
              discipline_id: dailyFrequencyStudent.disciplineId,
              student_id: dailyFrequencyStudent.studentId,
              class_number: dailyFrequencyStudent.classNumber,
              frequency_date: dailyFrequencyStudent.frequencyDate
            }
          );

          dailyFrequencyStudentObservables.push(request)
        })

        Observable.concat(...dailyFrequencyStudentObservables).subscribe(
          (result) => {
            observer.next(result)
          },
          (error) => {
            observer.error(error)
          },
          () => {
            this.deleteDailyFrequencyStudents(dailyFrequencyStudents)
            observer.complete()
          }
        )
      }else{
        observer.complete()
      }
    })
  }

  private deleteDailyFrequencyStudents(dailyFrequencyStudents){
    dailyFrequencyStudents.forEach((dailyFrequencyStudent) => {
      this.deleteStudentFrequency(dailyFrequencyStudent)
    });
  }

  private deleteStudentFrequency(dailyFrequencyStudent){
    let newDailyFrequencyStudentsToSync = []
    this.storage.get('dailyFrequencyStudentsToSync').then((localDailyFrequencyStudents) => {
      newDailyFrequencyStudentsToSync = localDailyFrequencyStudents.filter((localDailyFrequencyStudent) => {
        return (dailyFrequencyStudent.classNumber != localDailyFrequencyStudent.classNumber ||
               dailyFrequencyStudent.classroomId != localDailyFrequencyStudent.classroomId ||
               dailyFrequencyStudent.disciplineId != localDailyFrequencyStudent.disciplineId ||
               dailyFrequencyStudent.frequencyDate != localDailyFrequencyStudent.frequencyDate ||
               dailyFrequencyStudent.studentId != localDailyFrequencyStudent.studentId ||
               dailyFrequencyStudent.present != localDailyFrequencyStudent.present)
      })
      this.storage.set('dailyFrequencyStudentsToSync', newDailyFrequencyStudentsToSync)
    })
  }
}