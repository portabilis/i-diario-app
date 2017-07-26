// Imports from angular
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';

// Imports from Ionic
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage'
import { Network } from '@ionic-native/network';

//Pages
import { MyApp } from './app.component';
import { SignIn } from '../pages/sign-in/sign-in';
import { FrequencyPage } from '../pages/frequency/frequency';
import { StudentsFrequencyPage } from '../pages/students-frequency/students-frequency';
import { FrequencyIndexPage } from "../pages/frequency-index/frequency-index";
import { UserIndexPage } from './../pages/user-index/user-index';
import { AppIndexPage } from "../pages/app-index/app-index";
import { LessonPlanDetailsPage } from './../pages/lesson-plan-details/lesson-plan-details';
import { LessonPlanIndexPage } from './../pages/lesson-plan-index/lesson-plan-index';
import { TeachingPlanDetailsPage } from './../pages/teaching-plan-details/teaching-plan-details';
import { TeachingPlanIndexPage } from './../pages/teaching-plan-index/teaching-plan-index';
import { SynchronizationPage } from './../pages/synchronization/synchronization';

//Services
import { AuthService } from '../services/auth';
import { UnitiesService } from '../services/unities';
import { ClassroomsService } from '../services/classrooms';
import { DailyFrequencyService } from '../services/daily_frequency';
import { ExamRulesService } from '../services/exam_rules';
import { DisciplinesService } from '../services/disciplines';
import { SchoolCalendarsService } from './../services/school_calendars';
import { ConnectionService } from '../services/connection';
import { LessonPlansService } from './../services/lesson_plans';
import { TeachingPlansService } from './../services/teaching_plans';
import { DailyFrequencyStudentService } from '../services/daily_frequency_student';
import { OfflineDataPersisterService } from './../services/offline_data_persistence/offline_data_persister';
import { ClassroomsPersisterService } from './../services/offline_data_persistence/classrooms_persister';
import { ExamRulesPersisterService } from './../services/offline_data_persistence/exam_rules_persister';
import { UnitiesPersisterService } from './../services/offline_data_persistence/unities_persister';
import { DisciplinesPersisterService } from './../services/offline_data_persistence/disciplines_persister';
import { FrequenciesPersisterService } from './../services/offline_data_persistence/frequencies_persister';
import { SchoolCalendarsPersisterService } from './../services/offline_data_persistence/school_calendars_persister';
import { ApiService } from './../services/api';
import { DailyFrequenciesSynchronizer } from './../services/offline_data_synchronization/daily_frequencies_synchronizer';
import { LessonPlansPersisterService } from './../services/offline_data_persistence/lesson_plans_persister';
import { TeachingPlansPersisterService } from './../services/offline_data_persistence/teaching_plans_persister';
import { StorageManagerService } from './../services/storage_manager';

@NgModule({
  declarations: [
    MyApp,
    SignIn,
    FrequencyPage,
    StudentsFrequencyPage,
    FrequencyIndexPage,
    AppIndexPage,
    UserIndexPage,
    LessonPlanIndexPage,
    LessonPlanDetailsPage,
    TeachingPlanIndexPage,
    TeachingPlanDetailsPage,
    SynchronizationPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp,{
      backButtonText: ""
    }),
    HttpModule,
    IonicStorageModule.forRoot({
      name: '__appfrequencia',
         driverOrder: ['indexeddb']
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SignIn,
    FrequencyPage,
    StudentsFrequencyPage,
    FrequencyIndexPage,
    AppIndexPage,
    UserIndexPage,
    LessonPlanIndexPage,
    LessonPlanDetailsPage,
    TeachingPlanIndexPage,
    TeachingPlanDetailsPage,
    SynchronizationPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthService,
    UnitiesService,
    ClassroomsService,
    DailyFrequencyService,
    ExamRulesService,
    DisciplinesService,
    SchoolCalendarsService,
    DailyFrequencyStudentService,
    ConnectionService,
    LessonPlansService,
    TeachingPlansService,
    Network,
    OfflineDataPersisterService,
    UnitiesPersisterService,
    ClassroomsPersisterService,
    ExamRulesPersisterService,
    SchoolCalendarsPersisterService,
    DisciplinesPersisterService,
    FrequenciesPersisterService,
    LessonPlansPersisterService,
    TeachingPlansPersisterService,
    ApiService,
    StorageManagerService,
    DailyFrequenciesSynchronizer,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
