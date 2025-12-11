import { Injectable } from '@angular/core';
import { Observable, of, forkJoin, switchMap } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ClassroomsPersisterService } from './classrooms_persister';
import { ContentLessonPlansPersisterService } from './content_lesson_plans_persister';
import { ContentRecordsPersisterService } from './content_records_persister';
import { DisciplinesPersisterService } from './disciplines_persister';
import { ExamRulesPersisterService } from './exam_rules_persister';
import { LessonPlansPersisterService } from './lesson_plans_persister';
import { SchoolCalendarsPersisterService } from './school_calendars_persister';
import { TeachingPlansPersisterService } from './teaching_plans_persister';
import { UnitiesPersisterService } from './unities_persister';
import { ConnectionService } from '../connection';
import { User } from '../../data/user.interface';
import { DisciplineFrequenciesPersisterService } from './discipline_frequencies_persister';
import { StudentsPersisterService } from './students_persister';
import { GlobalFrequenciesPersisterService } from './global_frequencies_persister';
import { StorageService } from '../storage.service';
import { ObservationDiariesPersisterService } from "./observation_diaries_persister";
import { DailyNotesPersisterService } from "./daily_notes_persister";

@Injectable()
export class OfflineDataPersisterService {
  constructor(
    private storage: StorageService,
    private unitiesPersister: UnitiesPersisterService,
    private classroomsPersister: ClassroomsPersisterService,
    private examRulesPersister: ExamRulesPersisterService,
    private schoolCalendarsPersister: SchoolCalendarsPersisterService,
    private disciplinesPersister: DisciplinesPersisterService,
    private lessonPlansPersister: LessonPlansPersisterService,
    private contentLessonPlansPersister: ContentLessonPlansPersisterService,
    private contentRecordsPersister: ContentRecordsPersisterService,
    private teachingPlansPersister: TeachingPlansPersisterService,
    private dailyNotesPersister: DailyNotesPersisterService,
    private observationDiariesPersister: ObservationDiariesPersisterService,
    private disciplineFrequenciesPersister: DisciplineFrequenciesPersisterService,
    private studentsPersister: StudentsPersisterService,
    private globalFrequenciesPersister: GlobalFrequenciesPersisterService,
    private connectionService: ConnectionService,
  ) {}

  private clearStorage(): void {
    this.storage.remove('classrooms').then();
    this.storage.remove('contentLessonPlans').then();
    this.storage.remove('contentRecords').then();
    this.storage.remove('dailyNotes').then();
    this.storage.remove('disciplines').then();
    this.storage.remove('examRules').then();
    this.storage.remove('frequencies').then();
    this.storage.remove('lessonPlans').then();
    this.storage.remove('schoolCalendars').then();
    this.storage.remove('teachingPlans').then();
    this.storage.remove('observationDiaries').then();
    this.storage.remove('unities').then();
  }

  persist(user: User): Observable<any> {
    // Antes de uma sincronização ser executada é necessário limpar o storage
    // para evitar que os dados sejam duplicados. Isso acontecia com as
    // frequências que apareciam duplicadas pelo número de sincronizações
    // feitas.
    if (this.connectionService.isOnline) {
      this.clearStorage();
    }

    return of(user).pipe(
      map((user) => ({ user })),

      tap(({ user }) => {
        if (!user.teacher_id) {
          throw new Error('Seu usuário não possui vínculo de professor.');
        }
      }),

      // Passo 1
      // Sincronizar as unidades (escolas)
      // Sincronizar os planos de ensinos
      // Sincronizar os conteúdos dos planos de ensinos
      // Sincronizar os conteúdos
      // Sincronizar os planos de aula
      switchMap((payload) =>
        forkJoin({
          unities: this.unitiesPersister.persist(user),
          lessonPlans: this.lessonPlansPersister.persist(user),
          contentRecords: this.contentRecordsPersister.persist(user),
          contentLessonPlans: this.contentLessonPlansPersister.persist(user),
          teachingPlans: this.teachingPlansPersister.persist(user),
        }).pipe(map((result) => ({ ...payload, ...result }))),
      ),

      // Passo 2
      // Sincronizar os calendários letivos: depende das unidades
      // Sincronizar as turmas: depende das unidades
      switchMap((payload) =>
        forkJoin({
          schoolCalendars: this.schoolCalendarsPersister.persist(
            user,
            payload.unities,
          ),
          classrooms: this.classroomsPersister.persist(user, payload.unities),
        }).pipe(map((result) => ({ ...payload, ...result }))),
      ),

      // Passo 3
      // Sincronizar as regras de avaliação: depende das turmas
      // Sincronizar as disciplinas: depende das turmas
      switchMap((payload) =>
        forkJoin({
          examRules: this.examRulesPersister.persist(user, payload.classrooms),
          disciplines: this.disciplinesPersister.persist(
            user,
            payload.classrooms,
          ),
        }).pipe(map((result) => ({ ...payload, ...result }))),
      ),

      // Passo 4
      // Sincronizar as frequências por dia: depende das turmas e da regra de avaliação
      // Sincronizar as frequências por componente: depende das disciplinas e da regra de avaliação
      // Sincronizar os alunos: depende das turmas (dentro de disciplina) e das disciplinas
      switchMap((payload) =>
        forkJoin({
          globalFrequencies: this.globalFrequenciesPersister.persist(
            user,
            payload.classrooms,
            payload.examRules,
          ),
          disciplineFrequencies: this.disciplineFrequenciesPersister.persist(
            user,
            payload.disciplines,
            payload.examRules,
          ),
          students: this.studentsPersister.persist(user, payload.disciplines),
        }).pipe(map((result) => ({ ...payload, ...result }))),
      ),

      // Passo 5
      // Sincronizar os diários de observações: depende das turmas, das disciplinas e dos alunos
      switchMap((payload) =>
        forkJoin({
          dailyNotes: this.dailyNotesPersister.persist(user, payload.disciplines),
          observationDiaries: this.observationDiariesPersister.persist(user),
        }).pipe(map((result) => ({ ...payload, ...result }))),
      ),

      // Manipulador de erros global
      catchError((error) => {
        console.error(error);
        throw error;
      }),
    );
  }
}
