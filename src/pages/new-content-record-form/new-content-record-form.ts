import { LoadingController, NavController, NavParams } from 'ionic-angular';

import { NgForm } from '@angular/forms';
import { Component } from '@angular/core';

import { ClassroomsService } from '../../services/classrooms';
import { DisciplinesService } from '../../services/disciplines';
import { UtilsService } from './../../services/utils';

import { ContentRecordFormPage } from '../content-record-form/content-record-form';

import { Unity } from '../../data/unity.interface';
import { Classroom } from '../../data/classroom.interface';

@Component({
  selector: 'page-new-content-record-form',
  templateUrl: 'new-content-record-form.html',
})
export class NewContentRecordFormPage{
  private unities: Unity[];
  private unityId: number;
  private classrooms: Classroom[];
  private classroomId: number;
  private date: any;
  private disciplines: any;
  private disciplineId: number;
  private emptyUnities: boolean = true;

  constructor(
    private classroomsService: ClassroomsService,
    private loadingCtrl: LoadingController,
    private disciplinesService: DisciplinesService,
    private navCtrl: NavController,
    private navParams: NavParams,
    private utilsService: UtilsService){}

  ionViewWillEnter(){
    let date = this.navParams.get('date') || this.utilsService.getCurrentDate();
    this.date = this.utilsService.toStringWithoutTime(date);
    this.unities = this.navParams.get('unities');
    this.emptyUnities = (!this.unities || this.unities.length == 0);
    this.unityId = this.navParams.get('unityId');
  }

  onChangeUnity(){
    if(!this.unityId) { return }
    const loader = this.loadingCtrl.create({
      content: "Carregando..."
    });
    loader.present();

    this.classroomsService.getOfflineClassrooms(this.unityId).subscribe((classrooms: any) => {
      this.classrooms = classrooms.data;
    },
    (error) => {
      console.log(error);
    },
    () => {
      loader.dismiss()
    });
  }

  onChangeClassroom(){
    if(!this.classroomId) { return }
    this.disciplineId = null;

    const loader = this.loadingCtrl.create({
      content: "Carregando..."
    });
    loader.present();

    this.disciplinesService.getOfflineDisciplines(this.classroomId).subscribe(
      (result: any) => {
        this.disciplines = result.data;
      },
      (error) => {
        console.log(error)
      },
      () => {
        loader.dismiss()
      }
    );
  }

  submitNewContentRecord(form: NgForm){
    const unityId = form.value.unity
    const unityName = this.unities.filter(d=>d['id']==unityId)[0]['description'];
    const classroomId = form.value.classroom
    const selectedClassroom = this.classrooms.filter(d=>d['id']==classroomId)[0];
    const gradeId = selectedClassroom['grade_id'];
    const classroomDescription = selectedClassroom['description'];
    const date = this.utilsService.dateToTimezone(form.value.date);
    const stringDate = this.utilsService.toStringWithoutTime(date)
    const disciplineId = form.value.discipline;
    const disciplineDescription = this.disciplines.filter(d=>d['id']==disciplineId)[0]['description'];

    this.navCtrl.push(ContentRecordFormPage, {
      date: stringDate,
      unityId: unityId,
      disciplineId: disciplineId,
      classroomId: classroomId,
      gradeId: gradeId,
      description: disciplineDescription,
      classroomName: classroomDescription,
      unityName: unityName
    });
  }
  resetSelectedValues(){
    this.classroomId = null;
    this.disciplineId = null;
  }

  goBack() {
    this.navCtrl.pop();
  }
}
