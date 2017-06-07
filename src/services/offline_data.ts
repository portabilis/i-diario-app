import { ExamRulesService } from './exam_rules';
import { Discipline } from './../data/discipline.interface';
import { DisciplinesService } from './disciplines';
import { Classroom } from './../data/classroom.interface';
import { Unity } from './../data/unity.interface';
import { User } from './../data/user.interface';
import { ClassroomsService } from './classrooms';
import { UnitiesService } from './unities';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable'

@Injectable()
export class OfflineDataService {
  constructor(
    private storage: Storage,
    private unities: UnitiesService,
    private classrooms: ClassroomsService,
    private disciplines: DisciplinesService,
    private examRules: ExamRulesService
  ){}

  private clearStorage(){
    this.storage.clear();
  }

  persistAll(user: User){
    this.clearStorage();

    //substituir as ocorrencias por user.teacher_id
    var teacherId = 23;

    this.unities.getUnities(teacherId).subscribe(
      (unities) => {
        this.storage.set('unities', unities)
      },
      (error) => {
        console.log(error)
      },
      () => {
        this.persistClassrooms(teacherId)
      }
    )
  }

  persistClassrooms(teacherId){
    this.storage.get('unities').then((unities) => {
      let classroomsObservables = []
      let unitiesIds = []
      unities.forEach((unity) => {
        classroomsObservables.push(this.classrooms.getClassrooms(teacherId, unity.id))
      })

      Observable.forkJoin(classroomsObservables).subscribe(
        (results) => {
          let classroomList = []
          results.forEach((classrooms: any) => {
            classrooms.forEach((classroom) => {
              classroomList.push(classroom)
            })
          })
          this.storage.set('classrooms', classroomList)
        },
        (error) => {
          console.log(error)
        },
        () => {
          this.persistExamRules(teacherId)
        }
      )
    })
  }

  persistExamRules(teacherId){
    this.storage.get('classrooms').then((classrooms) => {
      let examRulesObservables = []
      let classroomIds = []
      classrooms.forEach(classroom => {
        classroomIds.push(classroom.id)
        examRulesObservables.push(this.examRules.getExamRules(teacherId, classroom.id))
      })
      Observable.forkJoin(examRulesObservables).subscribe(
        (results) => {
          let examRulesList = []
          results.forEach((result: any) => {
            examRulesList.push(result.exam_rule)
          })
          this.storage.set('examRules', examRulesList)
        },
        (error) => {
          console.log(error)
        },
        () => {
          this.storage.get('examRules').then((examRules) => {
            console.log(examRules)
          })
          this.storage.get('classrooms').then((classrooms) => {
            console.log(classrooms)
          })
        }
      )
    });
  }
}