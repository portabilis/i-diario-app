import { DailyFrequencyStudentService } from './../services/daily_frequency_student';
// Imports from angular
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';

// Imports from Ionic
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage'

//Pages
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SignIn } from '../pages/sign-in/sign-in';
import { FrequencyPage } from '../pages/frequency/frequency';
import { StudentsFrequencyPage } from '../pages/students-frequency/students-frequency';

//Services
import { AuthService } from '../services/auth';
import { UnitiesService } from '../services/unities';
import { ClassroomsService } from '../services/classrooms';
import { DailyFrequencyService } from '../services/daily_frequency';
import { ExamRulesService } from '../services/exam_rules';
import { DisciplinesService } from '../services/disciplines';
import { SchoolCalendarsService } from '../services/school_calendars';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SignIn,
    FrequencyPage,
    StudentsFrequencyPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp,{
      backButtonText: ""
    }),
    HttpModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SignIn,
    FrequencyPage,
    StudentsFrequencyPage
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
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
