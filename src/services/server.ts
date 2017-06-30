import { Injectable } from '@angular/core';

@Injectable()
export class ServerService {
  public server_url:string = 'http://prefeitura.educacao.local:3000/';

  getTeatcherClassroomsUrl() {
    return this.server_url + 'api/v1/teacher_classrooms.json'
  }
  getLoginUrl() {
    return this.server_url + 'usuarios/logar.json'
  }
  getDailyFrequencyStudentsUrl(id: number) {
    return this.server_url + 'api/v1/daily_frequency_students/' + id + '.json';
  }
  getDailyFrequencyUrl() {
    return this.server_url + 'api/v1/daily_frequencies.json'
  }
  getTeacherDisciplinesUrl() {
    return this.server_url + 'api/v1/teacher_disciplines.json'
  }
  getExamRulesUrl() {
    return this.server_url + 'api/v1/exam_rules.json'
  }
  getSchoolCalendarUrl() {
    return this.server_url + 'api/v1/calendarios-letivo.json'
  }
  getClassroomStudentsUrl() {
    return this.server_url + 'api/v1/classroom_students.json'
  }
  getTeacherUnitiesUrl() {
    return this.server_url + 'api/v1/teacher_unities.json'
  }
}