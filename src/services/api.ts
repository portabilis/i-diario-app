import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';

@Injectable()
export class ApiService {
  serverUrl: string = "";

  public allHosts =
      [
        {value: "https://***REMOVED***", name: "***REMOVED***"},
        {value: "https://***REMOVED***", name: "***REMOVED***"},
        {value: "https://***REMOVED***", name: "***REMOVED***"},
        {value: "https://***REMOVED***", name: "***REMOVED***"},
        {value: "https://***REMOVED***", name: "***REMOVED***"},
        {value: "https://***REMOVED***", name: "***REMOVED***"},
        {value: "https://***REMOVED***", name: "***REMOVED***"},
        {value: "https://***REMOVED***.***REMOVED***.com.br", name: "***REMOVED***"},
        {value: "https://***REMOVED***", name: "***REMOVED***"},
        {value: "https://***REMOVED***", name: "***REMOVED***"},
        {value: "https://***REMOVED***", name: "***REMOVED***"},
        {value: "https://***REMOVED***", name: "***REMOVED***"},
        {value: "https://***REMOVED***", name: "***REMOVED***"},
        {value: "https://***REMOVED***", name: "***REMOVED***"},
        {value: "https://***REMOVED***-mt.portabilis.com.br", name: "***REMOVED***"},
        {value: "https://***REMOVED***", name: "***REMOVED***"},
        {value: "https://***REMOVED***", name: "***REMOVED***"},
        {value: "https://***REMOVED***", name: "***REMOVED***"},
        {value: "https://***REMOVED***", name: "***REMOVED***"},
        {value: "https://***REMOVED***", name: "***REMOVED***"},
        {value: "https://***REMOVED***", name: "***REMOVED***"},
        {value: "https://***REMOVED***", name: "***REMOVED***"},
        {value: "https://***REMOVED***-sp.portabilis.com.br", name: "***REMOVED***"},
        {value: "https://***REMOVED***", name: "***REMOVED***"},
        {value: "https://***REMOVED***", name: "***REMOVED***"},
        {value: "https://***REMOVED***", name: "***REMOVED***"},
        {value: "https://***REMOVED***", name: "***REMOVED***"},
        {value: "https://***REMOVED***", name: "***REMOVED***"},
        {value: "https://***REMOVED***", name: "***REMOVED***"},
        {value: "https://***REMOVED***", name: "***REMOVED***"},
        {value: "http://172.17.0.1:3000", name: "Portabilis Local"},
        {value: "https://***REMOVED***", name: "Portabilis 1"},
        {value: "https://***REMOVED***", name: "Portabilis 2"},
        {value: "https://***REMOVED***", name: "Portabilis 3"},
        {value: "https://***REMOVED***", name: "Portabilis Comercial"},
        {value: "https://***REMOVED***", name: "***REMOVED***"},
        {value: "https://educacao.***REMOVED***.com.br", name: "***REMOVED***"},
        {value: "https://***REMOVED***", name: "***REMOVED***"},
        {value: "https://***REMOVED***", name: "***REMOVED***"},
        {value: "https://***REMOVED***", name: "***REMOVED***"},
        {value: "https://***REMOVED***.***REMOVED***.com.br", name: "***REMOVED***"},
        {value: "https://***REMOVED***", name: "***REMOVED***"},
        {value: "https://***REMOVED***", name: "***REMOVED***"},
        {value: "https://***REMOVED***", name: "Treinamento"},
        {value: "https://***REMOVED***", name: "Treinamento 1"},
        {value: "https://***REMOVED***", name: "Treinamento 2"},
        {value: "https://***REMOVED***", name: "***REMOVED***"},
        {value: "https://***REMOVED***", name: "***REMOVED***"},
        {value: "https://***REMOVED***", name: "***REMOVED***"},
        {value: "https://***REMOVED***", name: "***REMOVED***"},
        {value: "https://***REMOVED***-sp.***REMOVED***.com.br", name: "***REMOVED*** - SP"},
        {value: "https://***REMOVED***", name: "***REMOVED***"},
        {value: "https://***REMOVED***", name: "***REMOVED***"},
        {value: "https://***REMOVED***", name: "***REMOVED***"},
        {value: "https://***REMOVED***", name: "***REMOVED***"}
     ];

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
}
