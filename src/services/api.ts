import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';

@Injectable()
export class ApiService {
  serverUrl: string = "";

  constructor(
    private storage: Storage
  ){
    if (this.serverUrl == "") {
      this.storage.get('serverUrl').then(url => {
        this.serverUrl = url;
      })
    }
  }

  getServerUrl() {
    return this.serverUrl;
  }

  setServerUrl(serverUrl: string) {
    this.storage.set('serverUrl', serverUrl);
    this.serverUrl = serverUrl;
  }

  getTeatcherClassroomsUrl() {
    return this.getServerUrl() + '/api/v2/teacher_classrooms.json'
  }

  getLoginUrl() {
    return this.getServerUrl() + '/usuarios/logar.json'
  }

  getDailyFrequencyStudentsUrl(id: number) {
    return this.getServerUrl() + '/api/v2/daily_frequency_students/' + id + '.json';
  }

  getDailyFrequencyUrl() {
    return this.getServerUrl() + '/api/v2/diario-de-frequencia.json'
  }

  getTeacherDisciplinesUrl() {
    return this.getServerUrl() + '/api/v2/teacher_disciplines.json'
  }

  getExamRulesUrl() {
    return this.getServerUrl() + '/api/v2/exam_rules.json'
  }

  getSchoolCalendarUrl() {
    return this.getServerUrl() + '/api/v2/calendarios-letivo.json'
  }

  getClassroomStudentsUrl() {
    return this.getServerUrl() + '/api/v2/classroom_students.json'
  }

  getTeacherUnitiesUrl() {
    return this.getServerUrl() + '/api/v2/teacher_unities.json'
  }

  getTeacherLessonPlansUrl() {
    return this.getServerUrl() + '/api/v2/lesson_plans.json'
  }

  getContentLessonPlansUrl() {
    return this.getServerUrl() + '/api/v2/content_records/lesson_plans.json'
  }

  getContentRecordsUrl() {
    return this.getServerUrl() + '/api/v2/content_records.json'
  }

  getTeacherTeachingPlansUrl() {
    return this.getServerUrl() + '/api/v2/teaching_plans.json'
  }

  getDailyFrequencyStudentsUpdateOrCreateUrl() {
    return this.getServerUrl() + '/api/v2/daily_frequency_students/update_or_create.json'
  }

  getContentRecordsSyncUrl(){
    return this.getServerUrl() + '/api/v2/content_records/sync.json'
  }

  getallHostsUrl() {
    return '***REMOVED***';
  }
}