import { ConnectionService } from './../connection';
import { TeachingPlansPersisterService } from './teaching_plans_persister';
import { LessonPlansPersisterService } from './lesson_plans_persister';
import { ContentLessonPlansPersisterService } from './content_lesson_plans_persister';
import { ContentRecordsPersisterService } from './content_records_persister';
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
    private lessonPlansPersister: LessonPlansPersisterService,
    private contentLessonPlansPersister: ContentLessonPlansPersisterService,
    private contentRecordsPersister: ContentRecordsPersisterService,
    private teachingPlansPersister: TeachingPlansPersisterService,
    private connectionService: ConnectionService
  ) {}

  private clearStorage(){
    this.storage.remove('unities');
    this.storage.remove('classrooms');
    this.storage.remove('disciplines');
    this.storage.remove('examRules');
    this.storage.remove('schoolCalendars');
    this.storage.remove('frequencies');
    this.storage.remove('contentLessonPlans');
    this.storage.remove('contentRecords');
  }

  persist(user: User){
    if (this.connectionService.isOnline) {
      this.clearStorage();
    }

    return new Observable((observer) => {
      Observable.concat(
        this.unitiesPersister.persist(user),
        this.lessonPlansPersister.persist(user),
        this.contentRecordsPersister.persist(user),
        this.contentLessonPlansPersister.persist(user),
        this.teachingPlansPersister.persist(user)
      ).subscribe(
        () => {
        },
        (error) => {
          observer.error(error);
        },
        () => {
          observer.complete()
        }
      )
    })
  }
}