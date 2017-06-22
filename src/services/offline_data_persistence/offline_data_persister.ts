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
    private frequenciesPersister: FrequenciesPersisterService) {}

  private clearStorage(){
    this.storage.remove('unities')
    this.storage.remove('classrooms')
    this.storage.remove('disciplines')
    this.storage.remove('examRules')
    this.storage.remove('schoolCalendars')
    this.storage.remove('frequencies')
  }

  persist(user: User){
    this.clearStorage();

    Observable.concat(
      this.unitiesPersister.persist(user),
      this.classroomsPersister.persist(user),
      this.examRulesPersister.persist(user),
      this.schoolCalendarPersister.persist(user),
      this.disciplinePersister.persist(user),
      this.frequenciesPersister.persist(user)
    ).subscribe(
      () => {},
      () => {},
      () => {
        console.log('completed')
      }
    )
  }
}