import { User } from './../../data/user.interface';
import { LoadingController, NavController, NavParams } from 'ionic-angular';

import { NgForm } from '@angular/forms';
import { Component } from '@angular/core';

import { AuthService } from '../../services/auth';
import { UnitiesService } from '../../services/unities';
import { ClassroomsService } from '../../services/classrooms';
import { DisciplinesService } from '../../services/disciplines';
import { ExamRulesService } from '../../services/exam_rules';
import { DailyFrequencyService } from '../../services/daily_frequency';
import { SchoolCalendarsService } from '../../services/school_calendars';
import { ConnectionService } from '../../services/connection';
import { StudentsService } from '../../services/students';
import { OfflineDataPersisterService } from './../../services/offline_data_persistence/offline_data_persister';

import { StudentsFrequencyPage } from '../students-frequency/students-frequency';
import { OfflineStudentsFrequency } from '../offline-students-frequency/offline-students-frequency';

import { Unity } from '../../data/unity.interface';
import { Classroom } from '../../data/classroom.interface';

@Component({
  selector: 'page-frequency',
  templateUrl: 'frequency.html',
})
export class FrequencyPage{
  private unities: Unity[];
  private unityId: number;
  private classrooms: Classroom[];
  private classroomId: number;
  private date: any;
  private globalAbsence: boolean = true;
  private disciplines: any;
  private disciplineId: number;
  private classes: any;
  private selectedClasses:any = [];

  constructor(
    private unitiesService: UnitiesService,
    private classroomsService: ClassroomsService,
    private auth: AuthService,
    private loadingCtrl: LoadingController,
    private dailyFrequencyService: DailyFrequencyService,
    private examRulesService: ExamRulesService,
    private disciplinesService: DisciplinesService,
    private schoolCalendarsService: SchoolCalendarsService,
    private navCtrl: NavController,
    private connectionService: ConnectionService,
    private navParams: NavParams,
    private offlineDataPersister: OfflineDataPersisterService,
    private studentsService: StudentsService) {}

  ionViewWillEnter(){
    this.date = new Date().toISOString();
    this.unities = this.navParams.get('unities');
    if(this.connectionService.isOnline){
      this.auth.currentUser().then((user) => {
        this.offlineDataPersister.persist(user)
      })
    }
  }

  onChangeUnity(){
    if(!this.unityId) { return }
    const loader = this.loadingCtrl.create({
      content: "Carregando..."
    });
    loader.present();
    this.auth.currentUser().then((user: User) => {
      this.classroomsService.getClassrooms(user.teacher_id, this.unityId).subscribe(
        (classrooms: any) => {
          this.schoolCalendarsService.getSchoolCalendar(this.unityId).subscribe(
            (schoolCalendar: any) => {
              this.resetSelectedValues();
              this.classrooms = classrooms.data;
              this.classes = this.schoolCalendarsService.getClasses(schoolCalendar.data.number_of_classes);
            },
            (error) => {
              console.log(error)
            },
            () => {
              loader.dismiss()
            }
        )
      },
        (error) => {
          console.log(error);
        }
      );
    });
  }

  onChangeClassroom(){
    if(!this.classroomId) { return }
    this.disciplineId = null;
    this.selectedClasses = [];

    const loader = this.loadingCtrl.create({
      content: "Carregando..."
    });
    loader.present();

    this.auth.currentUser().then((user) => {

      this.examRulesService.getExamRules(user.teacher_id, this.classroomId).subscribe(
        (result:any) => {
          if(result.data.exam_rule && result.data.exam_rule.allow_frequency_by_discipline){
            this.disciplinesService.getDisciplines(user.teacher_id, this.classroomId).subscribe(
              (result: any) => {
                this.disciplines = result.data;
                this.globalAbsence = false;
            });
          }else{
            this.globalAbsence = true;
          }
        },
        (error) => {
          console.log(error)
        },
        () => {
          loader.dismiss()
        }
      )
    })
  }

  frequencyForm(form: NgForm){
    const unityId = form.value.unity;
    const classroomId = form.value.classroom;
    const date = form.value.date;
    const disciplineId = form.value.discipline;
    let classes:any[] = []
    if(form.value.classes){
      classes = form.value.classes;
    }

    const loader = this.loadingCtrl.create({
      content: "Carregando..."
    });
    loader.present();
    this.auth.currentUser().then((user) => {
      this.dailyFrequencyService.getStudents(
        user.id,
        user.teacher_id,
        unityId,
        classroomId,
        date,
        disciplineId,
        classes.join()
      ).subscribe(
        (result) => {
          this.navCtrl.push(StudentsFrequencyPage, {
              "frequencies": result,
              "global": this.globalAbsence })
        },
        (error) => {
          console.log(error);
        },
        () => {
          loader.dismiss();
        }
      );
    });
  }
  resetSelectedValues(){
    this.globalAbsence = true;
    this.classroomId = null;
    this.disciplineId = null;
    this.selectedClasses = [];
  }
}
