import { NgForm } from '@angular/forms';
import { LoadingController } from 'ionic-angular';
import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../services/auth';
import { UnitiesService } from '../../services/unities';
import { ClassroomsService } from '../../services/classrooms';
import { DisciplinesService } from '../../services/disciplines';
import { ExamRulesService } from '../../services/exam_rules';
import { DailyFrequencyService } from '../../services/daily_frequency';
import { SchoolCalendarsService } from '../../services/school_calendars';

@Component({
  selector: 'page-frequency',
  templateUrl: 'frequency.html',
})
export class FrequencyPage implements OnInit{
  private unities: any;
  private unity: any;
  private classrooms: any;
  private classroom: any;
  private date: any;
  private globalAbsence: boolean = true;
  private disciplines: any;
  private classes: any;

  constructor(
    private unitiesService: UnitiesService,
    private classroomsService: ClassroomsService,
    private auth: AuthService,
    private loadingCtrl: LoadingController,
    private dailyFrequencyService: DailyFrequencyService,
    private examRulesService: ExamRulesService,
    private disciplinesService: DisciplinesService,
    private schoolCalendarsService: SchoolCalendarsService){}

  ngOnInit(){
    this.auth.currentUser().then((user) => {
      this.unitiesService.getUnities(user.teacher_id).then(result => {
        this.unities = result;
      }).catch(error => {
        console.log(error);
      });
    });
    this.date = new Date().toISOString();
  }

  onChangeUnity(){
    const loader = this.loadingCtrl.create({
      content: "Carregando..."
    });
    loader.present();
    this.auth.currentUser().then((user) => {
      this.classroomsService.getClassrooms(user.teacher_id, this.unity).then(result => {
        this.classrooms = result;
        loader.dismiss();
      }).catch(error => {
        console.log(error);
        loader.dismiss();
      });

      this.schoolCalendarsService.getSchoolCalendar(this.unity).then(result => {
        this.classes = this.schoolCalendarsService.getClasses(result.number_of_classes);
        console.log(this);
      });
    });
  }

  onChangeClassroom(){
    const loader = this.loadingCtrl.create({
      content: "Carregando..."
    });
    loader.present();
    this.auth.currentUser().then((user) => {
      this.examRulesService.getExamRules(user.teacher_id, this.classroom).then(result => {
        if(result.exam_rule && result.exam_rule.allow_frequency_by_discipline){
          this.disciplinesService.getDisciplines(user.teacher_id, this.classroom).then(result => {
            this.disciplines = result;
            this.globalAbsence = false;
          });
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
        null,
        null
      ).then(result => {
        loader.dismiss();
        console.log(result);
      }).catch(error => {
        loader.dismiss();
        console.log(error);
      });
    });

  }
}
