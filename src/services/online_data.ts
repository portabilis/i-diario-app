import { TeachingPlansService } from './teaching_plans';
import { LessonPlansService } from './lesson_plans';
import { DailyFrequencyService } from './daily_frequency';
import { DisciplinesService } from './disciplines';
import { Observable } from 'rxjs/Observable';
import { SchoolCalendarsService } from './school_calendars';
import { ExamRulesService } from './exam_rules';
import { ClassroomsService } from './classrooms';
import { Storage } from '@ionic/storage';
import { User } from './../data/user.interface';
import { UnitiesService } from './unities';
import { StorageManagerService } from './storage_manager';
import { Injectable } from '@angular/core';

@Injectable()
export class OnlineDataService {
  constructor(
    private _storageManager: StorageManagerService,
    private _unities: UnitiesService,
    private _storage: Storage,
    private _classrooms: ClassroomsService,
    private _examRules: ExamRulesService,
    private _schoolCalendars: SchoolCalendarsService,
    private _disciplines: DisciplinesService,
    private _frequencies: DailyFrequencyService,
    private _lessonPlans: LessonPlansService,
    private _teachinPlans: TeachingPlansService
  ) {}

  public retrieve(user: User) {
    this._storageManager.clearStorage();
    this.retrieveUnitiesAndDependencies(user);
    this.retrieveLessonPlans(user);
    this.retrieveTeachinPlans(user);
  }

  private retrieveUnitiesAndDependencies(user: User){
    this._unities.getUnities(user.teacher_id)
      .toPromise()
      .then(unities => {
          this._storage.set('unities', unities)
          this.retrieveClassrooms(unities, user);
          this.schoolCalendars(unities);
      });
  }

  private retrieveClassrooms(unities, user: User){
    let classroomsObservables = []
    unities.forEach((unity) => {
      classroomsObservables.push(this._classrooms.getClassrooms(user.teacher_id, unity.id))
    })

    Observable.forkJoin(classroomsObservables).subscribe(
      (classrooms) => {
        this._storage.set('classrooms', classrooms)
        this.retrieveExamRules(classrooms, user);
        this.disciplines(classrooms, user);
      },
      (error) => {
        console.log(error)
      }
    )
  }

  private retrieveExamRules(classrooms, user: User) {
    let examRulesObservables = []
    classrooms.forEach(classroomList => {
      classroomList.data.forEach((classroom) => {
        examRulesObservables.push(this._examRules.getExamRules(user.teacher_id, classroom.id))
      })
    })
    Observable.forkJoin(examRulesObservables).subscribe(
      (results) => {
        this._storage.set('examRules', results)
      },
      (error) => {
        console.log(error)
      }
    )
  }

  private schoolCalendars(unities) {
    let schoolCalendarObservables = []
    unities.forEach((unity) => {
      schoolCalendarObservables.push(this._schoolCalendars.getSchoolCalendar(unity.id))
    })

    Observable.forkJoin(schoolCalendarObservables).subscribe(
      (results) => {
        this._storage.set('schoolCalendars', results)
      },
      (error) => {
        console.log(error)
      }
    )
  }

  private disciplines(classrooms, user: User) {
    let classroomObservables = []
    classrooms.forEach((classroomList) => {
      classroomList.data.forEach((classroom) => {
        classroomObservables.push(this._disciplines.getDisciplines(user.teacher_id, classroom.id))
      })
    })
    Observable.forkJoin(classroomObservables).subscribe(
      (result) => {
        this._storage.set('disciplines', result)
        this.frequencies(result, user);
      },
      (error) => {
        console.log(error)
      }
    )
  }

  private frequencies(disciplines, user: User) {
    let frequenciesObservables = []
    disciplines.forEach((disciplineList) => {
      disciplineList.data.forEach((discipline) => {
        frequenciesObservables.push(this._frequencies.getFrequencies(disciplineList.classroomId, discipline.id, user.teacher_id))
      });
    })

    Observable.forkJoin(frequenciesObservables).subscribe(
      (results) => {

        const notEmptyResults = results.filter(this.notEmptyDailyFrequencies)
        const mergedResults = notEmptyResults.map((result: any) => {
          return result.data.daily_frequencies
        }).reduce((a:any,b:any) => {
          return a.concat(b)
        })

        this._storage.set('frequencies', { daily_frequencies: mergedResults })
      },
      (error) => {
        console.log(error)
      }
    )
  }

  private notEmptyDailyFrequencies(dailyFrequencies){
    return dailyFrequencies.data.daily_frequencies.length > 0
  }

  private retrieveLessonPlans(user: User) {
    this._lessonPlans.getLessonPlans(user.teacher_id).subscribe(
      (lesson_plans) => {
        this._storage.set('lesson_plans', lesson_plans)
      },
      (error) => {
        console.log(error)
      }
    )
  }

  private retrieveTeachinPlans(user: User) {
    this._teachinPlans.getTeachingPlans(user.teacher_id).subscribe(
      (teachin_plans) => {
        this._storage.set('teachin_plans', teachin_plans)
      },
      (error) => {
        console.log(error)
      }
    )
  }
}