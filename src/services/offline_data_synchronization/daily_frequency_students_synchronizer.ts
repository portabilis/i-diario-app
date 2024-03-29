import { ApiService } from './../api'
import { Observable } from 'rxjs/Observable'
import { Storage } from '@ionic/storage'
import { Injectable } from '@angular/core'
import { CustomHttp } from '../custom_http';
import { AuthService } from '../auth';

@Injectable()
export class DailyFrequencyStudentsSynchronizer {
  constructor(
    private http: CustomHttp,
    private api: ApiService,
    private storage: Storage,
    private auth: AuthService
  ){

  }

  public sync(dailyFrequencyStudents){
    return new Observable((observer) => {
      if(dailyFrequencyStudents){
        this.auth.currentUser().then((user) => {
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
                frequency_date: dailyFrequencyStudent.frequencyDate,
                teacher_id: user.teacher_id
              }
            )

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
              this.deleteFrequencies(dailyFrequencyStudents)
              observer.complete()
            }
          )
        });
      }else{
        observer.complete()
      }
    })
  }

  private deleteFrequencies(dailyFrequencyStudents){
    let newDailyFrequencyStudents = []
    this.storage.get('dailyFrequencyStudentsToSync').then((localDailyFrequencyStudents) => {
      dailyFrequencyStudents.forEach((dailyFrequencyStudent) => {
        const foundFrequency = localDailyFrequencyStudents.find((localDailyFrequencyStudent) => {
          return (dailyFrequencyStudent.classNumber == localDailyFrequencyStudent.classNumber &&
                  dailyFrequencyStudent.classroomId == localDailyFrequencyStudent.classroomId &&
                  dailyFrequencyStudent.disciplineId == localDailyFrequencyStudent.disciplineId &&
                  dailyFrequencyStudent.frequencyDate == localDailyFrequencyStudent.frequencyDate &&
                  dailyFrequencyStudent.studentId == localDailyFrequencyStudent.studentId)
        })

        if (!foundFrequency) {
          newDailyFrequencyStudents.push(dailyFrequencyStudent)
        }
      })

      this.storage.set('dailyFrequencyStudentsToSync', newDailyFrequencyStudents)

    })
  }
}
