import { TeachingPlansPersisterService } from './teaching_plans_persister';
import { LessonPlansPersisterService } from './lesson_plans_persister';
import { FrequenciesPersisterService } from './frequencies_persister';
import { DisciplinesPersisterService } from './disciplines_persister';
import { SchoolCalendarsPersisterService } from './school_calendars_persister';
import { ExamRulesPersisterService } from './exam_rules_persister';
import { ClassroomsPersisterService } from './classrooms_persister';
import { UnitiesPersisterService } from './unities_persister';
import { User } from './../../data/user.interface';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable'

@Injectable()

export class OfflineDataPersisterService {
  constructor(
    private storage: Storage,
    private unitiesPersister: UnitiesPersisterService,
    private classroomsPersister: ClassroomsPersisterService,
    private examRulesPersister: ExamRulesPersisterService,
    private schoolCalendarPersister: SchoolCalendarsPersisterService,
    private disciplinePersister: DisciplinesPersisterService,
    private frequenciesPersister: FrequenciesPersisterService,
    private lessonPlansPersister: LessonPlansPersisterService,
    private teachingPlansPersister: TeachingPlansPersisterService) {}

  private clearStorage(){
    this.storage.remove('unities')
    this.storage.remove('classrooms')
    this.storage.remove('disciplines')
    this.storage.remove('examRules')
    this.storage.remove('schoolCalendars')
    this.storage.remove('frequencies')
    this.storage.remove('dailyFrequencyStudentsToSync')
    this.storage.remove('dailyFrequenciesToSync')
  }

  persist(user: User){
    return new Observable((observer) => {
      this.clearStorage();

      Observable.forkJoin(
        this.unitiesPersister.persist(user),
        this.lessonPlansPersister.persist(user),
        this.teachingPlansPersister.persist(user)
      ).subscribe(
        () => {
        },
        (error) => {
          observer.error(error);
          console.log("Error on persist", error)
        },
        () => {
          observer.complete()
        }
      )
    })
  }
}