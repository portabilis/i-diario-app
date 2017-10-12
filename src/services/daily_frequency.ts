import { OfflineUnityFinder } from './offline_data_finder/unities';
import { OfflineClassroomFinder } from './offline_data_finder/classrooms';
import { OfflineDisciplineFinder } from './offline_data_finder/disciplines';
import { StudentsService } from './students';
import { Observable } from 'rxjs/Observable';
import { ConnectionService } from './connection';
import { ApiService } from './api';
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
    private api: ApiService,
    private studentsService: StudentsService,
    private offlineClassroomFinder: OfflineClassroomFinder,
    private offlineDisciplineFinder: OfflineDisciplineFinder,
    private offlineUnityFinder: OfflineUnityFinder
  ){}

  getStudents(params){
    return this.getOfflineStudents(params)
  }

  getOnlineStudents(params){
    const request = this.http.post(this.api.getDailyFrequencyUrl(),
      {
        user_id: params.userId,
        teacher_id: params.teacherId,
        unity_id: params.unityId,
        classroom_id: params.classroomId,
        frequency_date: params.frequencyDate,
        discipline_id: params.disciplineId,
        class_numbers: params.classNumbers
      }
    );
    return request.map((response: Response) => {
      return response.json();
    });
  }

  getOfflineStudents(params){
    const splitedClassNumbers = params.classNumbers.split(",")
    if(params.disciplineId){
      return this.getOfflineStudentsDisciplineAbsence(params.classroomId, params.unityId, params.disciplineId, splitedClassNumbers, params.frequencyDate)
    }else{
      return this.getOfflineStudentsGlobalAbsence(params.classroomId, params.unityId, params.disciplineId, params.frequencyDate)
    }
  }

  private getOfflineStudentsGlobalAbsence(classroomId, unityId, disciplineId, frequencyDate){
    return new Observable((observer) => {
      Observable.forkJoin(
        Observable.fromPromise(this.storage.get('frequencies')),
        Observable.fromPromise(this.storage.get('dailyFrequenciesToSync')),
        this.studentsService.getOfflineGlobalStudents(classroomId),
        this.offlineClassroomFinder.find({classroomId: classroomId}),
        this.offlineUnityFinder.find({unityId: unityId})
      ).subscribe((results) => {
        let dailyFrequencies = results[0] ? results[0].daily_frequencies : []
        let dailyFrequenciesToSync = results[1] || []
        let studentList = results[2] || []
        let classroom:any = results[3] || []
        let unity:any = results[4] || []

        let filteredDailyFrequencies = dailyFrequencies.filter((dailyFrequency) => {
          return (dailyFrequency.classroom_id == classroomId &&
                  dailyFrequency.frequency_date == frequencyDate &&
                  dailyFrequency.discipline_id == null &&
                  dailyFrequency.class_number == null)
        })

        if(filteredDailyFrequencies.length == 0){

          const newFrequencies = this.createOfflineGlobalFrequencies({
            classroomId: classroomId,
            classroomDescription: classroom.description,
            unityId: unityId,
            unityDescription: unity.description,
            students: studentList,
            frequencyDate: frequencyDate
          })

          filteredDailyFrequencies = filteredDailyFrequencies.concat(newFrequencies)
          this.saveOfflineFrequencies(dailyFrequencies, newFrequencies)
          this.saveOfflineFrequenciesToSync(dailyFrequenciesToSync, newFrequencies)
        }

        observer.next({daily_frequency: filteredDailyFrequencies[0]})
        observer.complete()

      })
    })
  }

  private getOfflineStudentsDisciplineAbsence(classroomId, unityId, disciplineId, splitedClassNumbers, frequencyDate){
    return new Observable((observer) => {
      Observable.forkJoin(
        Observable.fromPromise(this.storage.get('frequencies')),
        Observable.fromPromise(this.storage.get('dailyFrequenciesToSync')),
        this.studentsService.getOfflineDisciplineStudents(classroomId, disciplineId),
        this.offlineClassroomFinder.find({classroomId: classroomId}),
        this.offlineDisciplineFinder.find({disciplineId: disciplineId}),
        this.offlineUnityFinder.find({unityId: unityId})
      ).subscribe((results) => {
        let dailyFrequencies = results[0] ? results[0].daily_frequencies : []
        let dailyFrequenciesToSync = results[1] || []
        let studentList = results[2] || []
        let classroom:any = results[3]
        let discipline:any = results[4]
        let unity:any = results[5]

        let filteredDailyFrequencies = dailyFrequencies.filter((dailyFrequency) => {
          return (dailyFrequency.classroom_id == classroomId &&
                  dailyFrequency.discipline_id == disciplineId &&
                  splitedClassNumbers.includes(String(dailyFrequency.class_number)) &&
                  dailyFrequency.frequency_date == frequencyDate)
        })

        if(filteredDailyFrequencies.length == 0){
            const newFrequencies = this.createOfflineDisciplineFrequencies({
              classroomId: classroomId,
              classroomDescription: classroom.description,
              unityId: unityId,
              unityDescription: unity.description,
              disciplineId: disciplineId,
              disciplineDescription: discipline.description,
              students: studentList,
              frequencyDate: frequencyDate,
              classNumbers: splitedClassNumbers
            })

            filteredDailyFrequencies = filteredDailyFrequencies.concat(newFrequencies)
            this.saveOfflineFrequencies(dailyFrequencies, newFrequencies)
            this.saveOfflineFrequenciesToSync(dailyFrequenciesToSync, newFrequencies)

          } else if (filteredDailyFrequencies.length < splitedClassNumbers.length) {
            const frequencyClasses = filteredDailyFrequencies.map((frequency) => {
              return String(frequency.class_number)
            })

            const missingClasses = splitedClassNumbers.filter((classNumber) => {
              return !frequencyClasses.includes(classNumber)
            })

            const newFrequencies = this.createOfflineDisciplineFrequencies({
              classroomId: classroomId,
              classroomDescription: classroom.description,
              unityId: unityId,
              unityDescription: unity.description,
              disciplineId: disciplineId,
              disciplineDescription: discipline.description,
              students: studentList,
              frequencyDate: frequencyDate,
              classNumbers: missingClasses
            })

            filteredDailyFrequencies = filteredDailyFrequencies.concat(newFrequencies)

            this.saveOfflineFrequencies(dailyFrequencies, newFrequencies)
            this.saveOfflineFrequenciesToSync(dailyFrequenciesToSync, newFrequencies)
          }

          filteredDailyFrequencies = filteredDailyFrequencies.sort(this.byClassNumber)

          observer.next({daily_frequencies: filteredDailyFrequencies})
          observer.complete()
      })
    })
  }

  private saveOfflineFrequenciesToSync(dailyFrequenciesToSync, newFrequencies){
    dailyFrequenciesToSync = dailyFrequenciesToSync.concat(newFrequencies)
    this.storage.set('dailyFrequenciesToSync', dailyFrequenciesToSync)
  }

  private saveOfflineFrequencies(existingFrequencies, newFrequencies){
    const offlineFrequencies = existingFrequencies.concat(newFrequencies)
    this.storage.set('frequencies', { daily_frequencies: offlineFrequencies })
  }

  private createOfflineGlobalFrequencies(params){
    const students = params.students.data.classroom_students.map((element) => {
      return {
        active: true,
        daily_frequency_id: null,
        id: null,
        present: true,
        student: { id: element.student.id, name: element.student.name },
        created_at: null,
        updated_at: null
      }
    })

    return {
      id: null,
      class_number: null,
      classroom_id: params.classroomId,
      classroom_name: params.classroomDescription,
      unity_id: params.unityId,
      unity_name: params.unityDescription,
      discipline_id: null,
      discipline_name: null,
      frequency_date: params.frequencyDate,
      students: students,
      created_at: null,
      updated_at: null
    }
  }

  private createOfflineDisciplineFrequencies(params){
    const students = params.students.data.classroom_students.map((element) => {
      return {
        active: true,
        daily_frequency_id: null,
        id: null,
        present: true,
        student: { id: element.student.id, name: element.student.name },
        created_at: null,
        updated_at: null
      }
    })

    return params.classNumbers.map((classNumber) => {
      return {
        id: null,
        class_number: String(classNumber),
        classroom_id: params.classroomId,
        classroom_name: params.classroomDescription,
        unity_id: params.unityId,
        unity_name: params.unityDescription,
        discipline_id: params.disciplineId,
        discipline_name: params.disciplineDescription,
        frequency_date: params.frequencyDate,
        students: students,
        created_at: null,
        updated_at: null
      }
    })
  }

  private byClassNumber(a,b){
    if (a.class_number > b.class_number) {
      return 1;
    }
    if (a.class_number < b.class_number) {
      return -1;
    }
    return 0;
  }

  getFrequencies(classroomId, disciplineId, teacherId){
    const request = this.http.get(this.api.getDailyFrequencyUrl(),
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