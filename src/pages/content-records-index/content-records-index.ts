import { UtilsService } from './../../services/utils';
import { ContentRecordFormPage } from './../content-record-form/content-record-form';
import { NewContentRecordFormPage } from './../new-content-record-form/new-content-record-form';
import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { MessagesService } from './../../services/messages';
import { SyncProvider } from '../../services/sync';

@Component({
  selector: 'page-content-records-index',
  templateUrl: 'content-records-index.html',
})
export class ContentRecordsIndexPage {
  shownGroup = null;

  contentDays = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private sync: SyncProvider,
              private storage: Storage,
              private utilsService: UtilsService,
              private messages: MessagesService
            ) {
  }

  ionViewWillEnter() {
    this.loadContentDays();
  }

  refreshPage() {
    this.loadContentDays();
  }

  loadContentDays() {

    Observable.forkJoin(
      this.storage.get('contentLessonPlans'),
      this.storage.get('contentRecords'),
      this.storage.get('teachingPlans'),
      this.storage.get('classrooms')
    ).subscribe((results) => {
      let lessonPlans = results[0];
      let contentRecords = results[1];
      let teachingPlans = results[2]||{};
      let classrooms = results[3];

      this.contentDays = [];
      let currentDate = this.utilsService.getCurrentDate();
      currentDate.setHours(0,0,0,0);
      // TODO: Pegar de algum parâmetro o número de dias
      let numberOfDays = 7;
      for (let i = numberOfDays; i > 0; i--) {
        let unities = [];

        (contentRecords||[]).filter(x=>x.contents.length).forEach(contentRecord => {
          let contentDate = this.utilsService.getDate(contentRecord.record_date);
          contentDate.setHours(24,0,0,0);

          if(currentDate.getTime() == contentDate.getTime()){
            let unityIndex = unities.map(d=>d['id']).indexOf(contentRecord.unity_id);
            if(unityIndex < 0){
              unities.push({
                id: contentRecord.unity_id,
                name: contentRecord.unity_name,
                filledRecords: 0,
                totalRecords: 0,
                unityItems: []
              });
              unityIndex = unities.length-1;
            }

            unities[unityIndex]['filledRecords']++;
            unities[unityIndex]['totalRecords']++;

            unities[unityIndex].unityItems.push({
              discipline_id: contentRecord.discipline_id,
              classroom_id: contentRecord.classroom_id,
              grade_id: contentRecord.grade_id,
              description: contentRecord.description,
              classroom_name: contentRecord.classroom_name,
              contents: contentRecord.contents,
              plannedContents: [],
              type: 'contentRecord'
            });

          }
        });

        (lessonPlans||[]).forEach(lessonPlan => {

          let startAt = this.utilsService.getDate(lessonPlan.start_at);
          startAt.setHours(24,0,0,0);
          let endAt = this.utilsService.getDate(lessonPlan.end_at);
          endAt.setHours(24,0,0,0);

          if(currentDate >= startAt && currentDate <= endAt){
            let unityIndex = unities.map(d=> d['id']).indexOf(lessonPlan.unity_id);
            if(unityIndex >= 0){
              let description = lessonPlan.description + ' - ' + lessonPlan.classroom_name;
              let unityItemIndex = unities[unityIndex].unityItems.map(d=>d.description+' - '+d.classroom_name).indexOf(description);
              if(unityItemIndex >= 0 ){
                unities[unityIndex].unityItems[unityItemIndex].plannedContents = unities[unityIndex].unityItems[unityItemIndex].plannedContents.concat(lessonPlan.contents);
              }
            }


          }
        });

        (teachingPlans['unities']||[]).forEach(teachingPlanUnity => {

          let unityIndex = unities.map(d=> parseInt(d['id'])).indexOf(parseInt(teachingPlanUnity.unity_id));

          teachingPlanUnity.plans.forEach(teachingPlan => {

            if(unityIndex >= 0){

              this.getClassroomsByGradeAndUnity(classrooms, teachingPlanUnity.unity_id, teachingPlan.grade_id).forEach(classroom => {
                let description = teachingPlan.description + ' - ' + classroom.description;
                let unityItemIndex = unities[unityIndex].unityItems.map(d=>d.description+' - '+d.classroom_name).indexOf(description);

                if(unityItemIndex >=0){

                  if(!unities[unityIndex].unityItems[unityItemIndex].plannedContents || !unities[unityIndex].unityItems[unityItemIndex].plannedContents.length){

                    unities[unityIndex].unityItems[unityItemIndex].plannedContents = unities[unityIndex].unityItems[unityItemIndex].plannedContents.concat(teachingPlan.contents);
                  }
                }
              });
            }
          });
        });

        // Calcular quantidade de conteúdos únicos entre registros de conteúdos e planos de aulas
        unities.forEach((unity, unityIndex) => {
          unities[unityIndex].situation_percentage = (unity.filledRecords / unity.totalRecords||0).toLocaleString();

          unity.unityItems.forEach((unityItem, unityItemIndex) => {
            let uniqueContents = unityItem.contents.concat(unityItem.plannedContents).map(d=>d.id+'-'+d.description).filter((v, i, a) => a.indexOf(v) === i);
            unities[unityIndex].unityItems[unityItemIndex].uniqueContents = uniqueContents;
          });
        });


        if(unities.length){
          this.contentDays.push({
            unities: unities,
            date: this.utilsService.toStringWithoutTime(currentDate),
            format_date: this.utilsService.toExtensiveFormat(currentDate)
          });
        }

        currentDate.setDate(currentDate.getDate()-1);
      }
    });
  }

  getClassroomsByGradeAndUnity(classrooms, unityId, gradeId){
    let filteredClassrooms = [];
    classrooms.filter(cu=>cu.unityId == unityId).forEach(classroomUnity => {
      classroomUnity.data.forEach(classroom => {
        if(classroom.grade_id == gradeId){
          filteredClassrooms.push(classroom);
        }
      });
    });
    return filteredClassrooms;
  }

  toggleGroup(group) {
    if (this.isGroupShown(group)) {
        this.shownGroup = null;
    } else {
        this.shownGroup = group;
    }
  };

  isGroupShown(group) {
      return this.shownGroup === group;
  };

  newContentRecordForm(contentDate, unityId){
    this.utilsService.hasAvailableStorage().then((available) => {
      if (!available) {
        this.messages.showError(this.messages.insuficientStorageErrorMessage('lançar novos registros de conteúdo'));
        return;
      }
      this.storage.get('unities').then((unities) => {
        this.navCtrl.push(NewContentRecordFormPage, { unities: unities, unityId: unityId, date: contentDate });
      });
    });
  }

  openContentRecordForm(date, unityId, disciplineId, classroomId, gradeId, description, classroomName, unityName){
    this.navCtrl.push(ContentRecordFormPage, {
      date: date,
      unityId: unityId,
      disciplineId: disciplineId,
      classroomId: classroomId,
      gradeId: gradeId,
      description: description,
      classroomName: classroomName,
      unityName: unityName,
      callback: this.refreshPage.bind(this)
    });
  }

  doRefresh() {
    this.sync.syncAll().subscribe(() => this.loadContentDays());
  }
}
