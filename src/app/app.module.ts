import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InterceptService } from './services/intercept.service';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage-angular';
import { ApiService } from './services/api';
import { ConnectionService } from './services/connection';
import { CustomersService } from './services/customers';
import { MessagesService } from './services/messages';
import { UtilsService } from './services/utils';
import { SyncProvider } from './services/sync';
import { DailyFrequenciesSynchronizer } from './services/offline_data_synchronization/daily_frequencies_synchronizer';
import { DailyFrequencyStudentsSynchronizer } from './services/offline_data_synchronization/daily_frequency_students_synchronizer';
import { ContentRecordsSynchronizer } from './services/offline_data_synchronization/content_records_synchronizer';
import { ObservationDiaryRecordsSynchronizer } from './services/offline_data_synchronization/observation_diary_records_synchronizer';
import { OfflineDataPersisterService } from './services/offline_data_persistence/offline_data_persister';
import { UnitiesPersisterService } from './services/offline_data_persistence/unities_persister';
import { UnitiesService } from './services/unities';
import { ClassroomsPersisterService } from './services/offline_data_persistence/classrooms_persister';
import { ClassroomsService } from './services/classrooms';
import { SchoolCalendarsService } from './services/school_calendars';
import { ExamRulesPersisterService } from './services/offline_data_persistence/exam_rules_persister';
import { ExamRulesService } from './services/exam_rules';
import { DisciplinesPersisterService } from './services/offline_data_persistence/disciplines_persister';
import { DisciplinesService } from './services/disciplines';
import { DisciplineFrequenciesPersisterService } from './services/offline_data_persistence/discipline_frequencies_persister';
import { DailyFrequencyService } from './services/daily_frequency';
import { StudentsService } from './services/students';
import { OfflineClassroomFinder } from './services/offline_data_finder/classrooms';
import { OfflineDisciplineFinder } from './services/offline_data_finder/disciplines';
import { OfflineUnityFinder } from './services/offline_data_finder/unities';
import { StudentsPersisterService } from './services/offline_data_persistence/students_persister';
import { GlobalFrequenciesPersisterService } from './services/offline_data_persistence/global_frequencies_persister';
import { SchoolCalendarsPersisterService } from './services/offline_data_persistence/school_calendars_persister';
import { LessonPlansPersisterService } from './services/offline_data_persistence/lesson_plans_persister';
import { LessonPlansService } from './services/lesson_plans';
import { ContentLessonPlansPersisterService } from './services/offline_data_persistence/content_lesson_plans_persister';
import { ContentLessonPlansService } from './services/content_lesson_plans';
import { ContentRecordsPersisterService } from './services/offline_data_persistence/content_records_persister';
import { ContentRecordsService } from './services/content_records';
import { TeachingPlansPersisterService } from './services/offline_data_persistence/teaching_plans_persister';
import { TeachingPlansService } from './services/teaching_plans';
import { DailyFrequencyStudentService } from './services/daily_frequency_student';
import { ObservationDiaryService } from "./services/observation_diary";
import { ObservationDiariesPersisterService } from "./services/offline_data_persistence/observation_diaries_persister";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot(),
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptService,
      multi: true,
    },
    provideHttpClient(withInterceptorsFromDi()),
    ApiService,
    ConnectionService,
    CustomersService,
    MessagesService,
    UtilsService,
    SyncProvider,
    DailyFrequenciesSynchronizer,
    DailyFrequencyStudentsSynchronizer,
    ContentRecordsSynchronizer,
    ObservationDiaryRecordsSynchronizer,
    OfflineDataPersisterService,
    UnitiesPersisterService,
    UnitiesService,
    ClassroomsPersisterService,
    ClassroomsService,
    SchoolCalendarsService,
    ExamRulesPersisterService,
    ExamRulesService,
    DisciplinesPersisterService,
    DisciplinesService,
    DisciplineFrequenciesPersisterService,
    DailyFrequencyService,
    StudentsService,
    OfflineClassroomFinder,
    OfflineDisciplineFinder,
    OfflineUnityFinder,
    StudentsPersisterService,
    GlobalFrequenciesPersisterService,
    SchoolCalendarsPersisterService,
    LessonPlansPersisterService,
    LessonPlansService,
    ContentLessonPlansPersisterService,
    ContentLessonPlansService,
    ContentRecordsPersisterService,
    ContentRecordsService,
    TeachingPlansPersisterService,
    TeachingPlansService,
    ObservationDiaryService,
    ObservationDiariesPersisterService,
    DailyFrequencyStudentService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
