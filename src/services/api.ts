import { Injectable } from '@angular/core';

@Injectable()
export class ApiService {
  public serverUrl:string = "";

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
        {value: "http://prefeitura.educacao.local:3000", name: "Portabilis Local"},
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

  setServerUrl(serverUrl: string) {
    this.serverUrl = serverUrl;
  }

  getTeatcherClassroomsUrl() {
    return this.serverUrl + '/api/v1/teacher_classrooms.json'
  }
  getLoginUrl() {
    return this.serverUrl + '/usuarios/logar.json'
  }
  getDailyFrequencyStudentsUrl(id: number) {
    return this.serverUrl + '/api/v1/daily_frequency_students/' + id + '.json';
  }
  getDailyFrequencyUrl() {
    return this.serverUrl + '/api/v1/daily_frequencies.json'
  }
  getTeacherDisciplinesUrl() {
    return this.serverUrl + '/api/v1/teacher_disciplines.json'
  }
  getExamRulesUrl() {
    return this.serverUrl + '/api/v1/exam_rules.json'
  }
  getSchoolCalendarUrl() {
    return this.serverUrl + '/api/v1/calendarios-letivo.json'
  }
  getClassroomStudentsUrl() {
    return this.serverUrl + '/api/v1/classroom_students.json'
  }
  getTeacherUnitiesUrl() {
    return this.serverUrl + '/api/v1/teacher_unities.json'
  }
}