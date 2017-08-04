import { Http, Response } from '@angular/http';
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
        {value: "http://localhost:3000", name: "Portabilis Local"},
        {value: "http://***REMOVED***", name: "Portabilis 1"},
        {value: "http://***REMOVED***", name: "Portabilis 2"},
        {value: "http://***REMOVED***", name: "Portabilis 3"},
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
     ];

  constructor(
    private storage: Storage
  ){
    if (this.serverUrl == "") {
      this.storage.get('server_url').then(url => {
        this.serverUrl = url;
      })
    }
  }

  getServerUrl() {
    return this.serverUrl;
  }

  setServerUrl(serverUrl: string) {
    this.storage.set('server_url', serverUrl);
    this.serverUrl = serverUrl;
  }

  getTeatcherClassroomsUrl() {
    return this.getServerUrl() + '/api/v1/teacher_classrooms.json'
  }
  getLoginUrl() {
    return this.getServerUrl() + '/usuarios/logar.json'
  }
  getDailyFrequencyStudentsUrl(id: number) {
    return this.getServerUrl() + '/api/v1/daily_frequency_students/' + id + '.json';
  }
  getDailyFrequencyUrl() {
    return this.getServerUrl() + '/api/v1/daily_frequencies.json'
  }
  getTeacherDisciplinesUrl() {
    return this.getServerUrl() + '/api/v1/teacher_disciplines.json'
  }
  getExamRulesUrl() {
    return this.getServerUrl() + '/api/v1/exam_rules.json'
  }
  getSchoolCalendarUrl() {
    return this.getServerUrl() + '/api/v1/calendarios-letivo.json'
  }
  getClassroomStudentsUrl() {
    return this.getServerUrl() + '/api/v1/classroom_students.json'
  }
  getTeacherUnitiesUrl() {
    return this.getServerUrl() + '/api/v1/teacher_unities.json'
  }
  getTeacherLessonPlansUrl() {
    return this.getServerUrl() + '/api/v1/lesson_plans.json'
  }
  getTeacherTeachingPlansUrl() {
    return this.getServerUrl() + '/api/v1/teaching_plans.json'
  }
  getDailyFrequencyStudentsUpdateOrCreateUrl() {
    return this.getServerUrl() + '/api/v1/daily_frequency_students/update_or_create.json'
  }
}