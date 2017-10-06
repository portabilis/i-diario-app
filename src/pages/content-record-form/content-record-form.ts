import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { UtilsService } from './../../services/utils';
import { ContentRecordsService } from './../../services/content_records';

@IonicPage()
@Component({
  selector: 'page-content-record-form',
  templateUrl: 'content-record-form.html',
})
export class ContentRecordFormPage {
  recordDate: string;
  unityId: number;
  disciplineId: number;
  classroomId: number;
  gradeId: number;
  displayDate: string;
  description;
  unityName;
  classroomName;
  callback;
  newContent = "";
  baseContents = {};
  contentRecord = {};
  contents = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private storage: Storage,
              private utilsService: UtilsService,
              private contentRecordService: ContentRecordsService
              ) {
  }

  ionViewWillLeave(){
    let oldContents = this.contentRecord['contents'].map(x=>x.description.trim()).sort();
    let currentContents = this.contents.filter(x=>x.checked).map(x=>x.description.trim()).sort();
    if(JSON.stringify(oldContents) != JSON.stringify(currentContents)){
      this.contentRecord['contents'] = this.contents.filter(x=>x.checked);
      this.contentRecordService.createOrUpdate(this.contentRecord).subscribe(()=> {
        if(typeof this.callback === 'function'){
          this.callback();
        }
      });
    }
  }

  loadContents(){

    this.contents = (this.baseContents['contents']||[]).concat(this.contentRecord['contents']||[]).filter((c1, i, self) => self.findIndex((c2) => {return c2.description === c1.description }) === i);
    (this.contentRecord['contents']||[]).forEach(content => {
      let index = this.contents.map(c=>c.description).indexOf(content.description);
      this.contents[index].checked = true;
    });
  }

  ionViewDidLoad() {
    this.baseContents = {};
    this.contentRecord = {};
    this.contents = [];
    this.recordDate = this.navParams.get('date');
    let date = new Date(this.recordDate);
    date.setHours(24,0,0,0);
    this.displayDate = this.utilsService.toExtensiveFormat(date);
    this.unityId = this.navParams.get('unityId');
    this.disciplineId = this.navParams.get('disciplineId');
    this.classroomId = this.navParams.get('classroomId');
    this.gradeId = this.navParams.get('gradeId');
    this.description = this.navParams.get('description');
    this.callback = this.navParams.get('callback');
    this.classroomName = this.navParams.get('classroomName');
    this.unityName = this.navParams.get('unityName');

    Observable.forkJoin(
      this.storage.get('contentLessonPlans'),
      this.storage.get('contentRecords'),
      this.storage.get('teachingPlans')
    ).subscribe(results=>{
      let contentLessonPlans = results[0]||[];
      let contentRecords = results[1]||[];
      let teachingPlans = results[2]||[];

      this.baseContents = this.getContentLessonPlan(contentLessonPlans);
      if(!Object.keys(this.baseContents).length){
        this.baseContents = this.getTeachingPlan(teachingPlans);
      }
      this.contentRecord = this.getContentRecord(contentRecords);
      if(!Object.keys(this.contentRecord).length){
        this.contentRecord = {
          id: undefined,
          record_date: this.recordDate,
          classroom_id: this.classroomId,
          classroom_name: this.classroomName,
          description: this.description,
          discipline_id: this.disciplineId,
          grade_id: this.gradeId,
          unity_id: this.unityId,
          unity_name: this.unityName,
          contents: []
        };
      }

      this.loadContents();
    });
  }

  addContent(){
    let indexFound = this.contents.findIndex((c, i, self) => this.utilsService.compareStrings(c.description, this.newContent));

    if(indexFound >= 0){
      this.contents[indexFound].checked = true;
    }else{
      this.contents.push({
        id: undefined,
        description: this.newContent,
        checked: true
      });
    }
    this.newContent = "";

    return false;
  }

  getContentLessonPlan(contentLessonPlans){
    let response = {};

    contentLessonPlans.forEach(plan => {
      if (
          plan.grade_id == this.gradeId &&
          plan.classroom_id == this.classroomId &&
          plan.discipline_id == this.disciplineId &&
          plan.unity_id == this.unityId &&
          plan.start_at <= this.recordDate &&
          plan.end_at >= this.recordDate
        ) {
        response = plan;
        return;
      }
    });

    return response;
  }

  getContentRecord(contentRecords){
    let response = {};
    contentRecords.forEach(contentRecord => {
      if (
          contentRecord.grade_id == this.gradeId &&
          contentRecord.classroom_id == this.classroomId &&
          contentRecord.discipline_id == this.disciplineId &&
          contentRecord.unity_id == this.unityId &&
          contentRecord.record_date == this.recordDate
        ){
        response = contentRecord;
        return;
      }
    });
    return response;
  }

  getTeachingPlan(teachingPlanUnities){
    let response = {};

    teachingPlanUnities.unities.filter(x=>x.unity_id==this.unityId).forEach(x=>{
      x.plans.forEach(teachingPlan => {
        if (teachingPlan.grade_id == this.gradeId &&
            teachingPlan.discipline_id == this.disciplineId ){

          response = teachingPlan;
          return;
        }
      });
    })
    return response;
  }

  goBack() {
    this.navCtrl.pop();
  }

}
