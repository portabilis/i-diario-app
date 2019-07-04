import { User } from './../../data/user.interface';
import { LoadingController, NavController, NavParams, Content } from 'ionic-angular';

import { NgForm } from '@angular/forms';
import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';

import { AuthService } from '../../services/auth';
import { UnitiesService } from '../../services/unities';
import { ClassroomsService } from '../../services/classrooms';
import { DisciplinesService } from '../../services/disciplines';
import { ExamRulesService } from '../../services/exam_rules';
import { DailyFrequencyService } from '../../services/daily_frequency';
import { SchoolCalendarsService } from '../../services/school_calendars';
import { ConnectionService } from '../../services/connection';
import { OfflineDataPersisterService } from './../../services/offline_data_persistence/offline_data_persister';
import { UtilsService } from './../../services/utils';

import { StudentsFrequencyPage } from '../students-frequency/students-frequency';

import { Unity } from '../../data/unity.interface';
import { Classroom } from '../../data/classroom.interface';
import { MessagesService } from './../../services/messages';

@Component({
  selector: 'page-frequency',
  templateUrl: 'frequency.html',
})
export class FrequencyPage{

  @ViewChild(Content) content: Content;

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
  private emptyUnities: boolean = true;

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
    private utilsService: UtilsService,
    private cdr: ChangeDetectorRef,
    private messages: MessagesService,
  ){}

  ionViewWillEnter(){
    if(!this.date){
      const currentDate = this.utilsService.getCurrentDate();
      this.date = this.utilsService.toStringWithoutTime(currentDate);
    }
    if(!this.unities || !this.unities.length){
      this.unities = this.navParams.get('unities');
      this.emptyUnities = (!this.unities || this.unities.length == 0);
    }
  }

  ionViewWillLeave() {
    this.utilsService.leaveView(true);
  }

  scrollTo(elementId:string) {
    let yOffset = document.getElementById(elementId).offsetTop;
    this.content.scrollTo(0, yOffset, 1000)
  }

  onChangeUnity(){
    if(!this.unityId) { return }
    const loader = this.loadingCtrl.create({
      content: "Carregando..."
    });
    loader.present();
    this.auth.currentUser().then((user: User) => {
      this.classroomsService.getOfflineClassrooms(this.unityId).subscribe(
        (classrooms: any) => {
          this.schoolCalendarsService.getOfflineSchoolCalendar(this.unityId).subscribe(
            (schoolCalendar: any) => {
              this.resetSelectedValues();
              this.classrooms = classrooms.data;
              if (!schoolCalendar.data) {
                this.messages.showToast('Calendário escolar não encontrado.');
                return;
              }

              this.classes = this.schoolCalendarsService.getClasses(schoolCalendar.data.number_of_classes);
              this.cdr.detectChanges();
              this.scrollTo("frequency-classroom");
            },
            (error) => {
              loader.dismiss()
              this.messages.showToast(error);
              return;
            },
            () => {
              loader.dismiss()
            }
        )
      },
      (error) => {
        loader.dismiss()
        this.messages.showToast(error);
      },
      () => {
        loader.dismiss()
      });
    });
  }

  onChangeClassroom(){
    if(!this.classroomId) { return }
    this.disciplineId = null;

    // Apenas limpar o selectedClasses está causando ExpressionChangedAfterItHasBeenCheckedError
    let _classes = this.classes;
    this.classes = [];
    this.selectedClasses = [];
    this.cdr.detectChanges();
    this.classes = _classes;

    const loader = this.loadingCtrl.create({
      content: "Carregando..."
    });
    loader.present();

    this.auth.currentUser().then((user) => {

      this.examRulesService.getOfflineExamRules(this.classroomId).subscribe(
        (result:any) => {
          if(result.data.exam_rule && result.data.exam_rule.allow_frequency_by_discipline){
            this.disciplinesService.getOfflineDisciplines(this.classroomId).subscribe(
              (result: any) => {
                this.disciplines = result.data;
                this.globalAbsence = false;
                this.cdr.detectChanges();
                this.scrollTo("frequency-discipline");
              },
              (error) => {},
              () => {
                loader.dismiss()
              }
            );
          }else{
            this.globalAbsence = true;
            loader.dismiss()
            this.cdr.detectChanges();
            this.scrollTo("frequency-date");
          }
        },
        (error) => {},
        () => {
          loader.dismiss()
        }
      )
    })
  }

  onChangeDiscipline(){
    this.scrollTo("frequency-classes");
  }

  frequencyForm(form: NgForm){
    const unityId = form.value.unity
    const classroomId = form.value.classroom
    const date = this.utilsService.dateToTimezone(form.value.date);
    const stringDate = this.utilsService.toStringWithoutTime(date)
    const disciplineId = form.value.discipline;
    let classes:any[] = []

    if(this.selectedClasses){
      classes = this.selectedClasses;
    }

    const loader = this.loadingCtrl.create({
      content: "Carregando..."
    });
    loader.present();
    this.auth.currentUser().then((user) => {
      this.dailyFrequencyService.getStudents({
        userId: user.id,
        teacherId: user.teacher_id,
        unityId: unityId,
        classroomId: classroomId,
        frequencyDate: stringDate,
        disciplineId: disciplineId,
        classNumbers: classes.join()
      }).subscribe(
        (result:any) => {
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

  updateSelectedClasses(selectedClass) {
    var index = this.selectedClasses.indexOf(selectedClass);

    if(index < 0) {
      this.selectedClasses.push(selectedClass);
    } else {
      this.selectedClasses.splice(index,1);
    }
  }

  goBack() {
    this.navCtrl.pop();
  }
}
