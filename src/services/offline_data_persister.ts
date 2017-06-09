import { User } from '../data/user.interface';
import { SchoolCalendarsService } from './school_calendars';
import { ExamRulesService } from './exam_rules';
import { DisciplinesService } from './disciplines';
import { ClassroomsService } from './classrooms';
import { UnitiesService } from './unities';
import { StudentsService } from './students';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable'

@Injectable()

export class OfflineDataPersisterService {
  constructor(
    private storage: Storage,
    private unities: UnitiesService,
    private classrooms: ClassroomsService,
    private disciplines: DisciplinesService,
    private examRules: ExamRulesService,
    private schoolCalendars: SchoolCalendarsService,
    private students: StudentsService) {}

  persist(user: User){
    this.unities.getUnities(user.teacher_id).subscribe(
      (unities) => {
        this.storage.set('unities', unities)
      },
      (error) => {
        console.log(error)
      },
      () => {
        this.persistClassrooms(user)
      }
    )
  }

  private persistClassrooms(user){
    this.storage.get('unities').then((unities) => {
      let classroomsObservables = []
      unities.forEach((unity) => {
        classroomsObservables.push(this.classrooms.getClassrooms(user.teacher_id, unity.id))
      })

      Observable.forkJoin(classroomsObservables).subscribe(
        (results) => {
          this.storage.set('classrooms', results)
        },
        (error) => {
          console.log(error)
        },
        () => {
          this.persistExamRules(user)
        }
      )
    })
  }

  private persistExamRules(user){
    this.storage.get('classrooms').then((results) => {
      let examRulesObservables = []
      results.forEach(classroomList => {
        classroomList.data.forEach((classroom) => {
          examRulesObservables.push(this.examRules.getExamRules(user.teacher_id, classroom.id))
        })
      })
      Observable.forkJoin(examRulesObservables).subscribe(
        (results) => {
          this.storage.set('examRules', results)
        },
        (error) => {
          console.log(error)
        },
        () => {
          this.persistSchoolCalendars(user)
        }
      )
    });
  }

  private persistSchoolCalendars(user){
    this.storage.get('unities').then((unities) => {
      let schoolCalendarObservables = []
      unities.forEach((unity) => {
        schoolCalendarObservables.push(this.schoolCalendars.getSchoolCalendar(unity.id))
      })
      Observable.forkJoin(schoolCalendarObservables).subscribe(
          (results) => {
            this.storage.set('schoolCalendars', results)
          },
          (error) => {
            console.log(error)
          },
          () => {
            this.persistDisciplines(user)
          }
        )
    });
  }

  private persistDisciplines(user){
    this.storage.get('classrooms').then((classrooms) => {
      let classroomObservables = []
      classrooms.forEach((classroomList) => {
        classroomList.data.forEach((classroom) => {
          classroomObservables.push(this.disciplines.getDisciplines(user.teacher_id, classroom.id))
        })
      })
      Observable.forkJoin(classroomObservables).subscribe(
        (result) => {
          this.storage.set('disciplines', result)
        },
        (error) => {
          console.log(error)
        },
        () => {
          this.persistStudents()
        }
      )
    })
  }

  private persistStudents(){
    this.storage.get('disciplines').then((disciplines) => {
      let studentsObservables = []
      disciplines.forEach((disciplineList) => {
        disciplineList.data.forEach((discipline) => {
          studentsObservables.push(this.students.getStudents(disciplineList.classroomId, discipline.id))
        })
      })

      Observable.forkJoin(studentsObservables).subscribe(
        (result) => {
          this.storage.set('students', result)
        },
        (error) => {
          console.log(error)
        },
        () => {
          this.storage.get('students').then((result) => {
            console.log(result)
          })
        }
      )
    })
  }
}