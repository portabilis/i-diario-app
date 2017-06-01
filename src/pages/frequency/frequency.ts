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

import { StudentsFrequencyPage } from '../students-frequency/students-frequency';

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
    private navParams: NavParams){
    }

  ionViewWillEnter(){
    this.date = new Date().toISOString();
    this.unities = this.navParams.get('unities');
  }

  onChangeUnity(){
    const loader = this.loadingCtrl.create({
      content: "Carregando..."
    });
    loader.present();
    this.auth.currentUser().then((user) => {
      this.classroomsService.getClassrooms(user.teacher_id, this.unityId).then((classrooms: Classroom[]) => {
        this.schoolCalendarsService.getSchoolCalendar(this.unityId).then(schoolCalendar => {
          this.resetSelectedValues();
          this.classrooms = classrooms;
          loader.dismiss();
          this.classes = this.schoolCalendarsService.getClasses(schoolCalendar.number_of_classes);
        });
      }).catch(error => {
        console.log(error);
        loader.dismiss();
      });
    });
  }

  onChangeClassroom(){
    const loader = this.loadingCtrl.create({
      content: "Carregando..."
    });
    loader.present();
    this.auth.currentUser().then((user) => {
      this.examRulesService.getExamRules(user.teacher_id, this.classroomId).then(result => {
        if(result.exam_rule && result.exam_rule.allow_frequency_by_discipline){
          this.disciplinesService.getDisciplines(user.teacher_id, this.classroomId).then(result => {
            this.disciplines = result;
            this.globalAbsence = false;
          });
        }else{
          this.globalAbsence = true;
        }
        loader.dismiss();
      }).catch(error => {
        console.log(error);
        loader.dismiss();
      });
    });
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
      ).then(result => {
        loader.dismiss();
        this.navCtrl.push(StudentsFrequencyPage, { "students": result, "classes": classes, "global": this.globalAbsence });
      }).catch(error => {
        loader.dismiss();
        console.log(error);
      });
    });
  }
  resetSelectedValues(){
    this.globalAbsence = true;
    this.classroomId = null;
    this.disciplineId = null;
    this.selectedClasses = [];
  }
}
