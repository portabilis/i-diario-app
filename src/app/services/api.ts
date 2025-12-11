import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class ApiService {
  serverUrl: string = '';

  constructor(private storage: StorageService) {
    this.storage.get('serverUrl').then((serverUrl) => {
      this.serverUrl = serverUrl;
    });
  }

  setServerUrl(serverUrl: string) {
    this.storage.set('serverUrl', serverUrl);
    this.serverUrl = serverUrl;
  }

  getTeacherClassroomsUrl() {
    return this.serverUrl + '/api/v2/teacher_classrooms.json';
  }

  getLoginUrl() {
    return this.serverUrl + '/usuarios/logar.json';
  }

  getDailyFrequencyStudentsUrl(id: number) {
    return this.serverUrl + '/api/v2/daily_frequency_students/' + id + '.json';
  }

  getDailyFrequencyUrl() {
    return this.serverUrl + '/api/v2/diario-de-frequencia.json';
  }

  getTeacherDisciplinesUrl() {
    return this.serverUrl + '/api/v2/teacher_disciplines.json';
  }

  getExamRulesUrl() {
    return this.serverUrl + '/api/v2/exam_rules.json';
  }

  getSchoolCalendarUrl() {
    return this.serverUrl + '/api/v2/calendarios-letivo.json';
  }

  getClassroomStudentsUrl() {
    return this.serverUrl + '/api/v2/classroom_students.json';
  }

  getTeacherUnitiesUrl() {
    return this.serverUrl + '/api/v2/teacher_unities.json';
  }

  getTeacherLessonPlansUrl() {
    return this.serverUrl + '/api/v2/lesson_plans.json';
  }

  getContentLessonPlansUrl() {
    return this.serverUrl + '/api/v2/content_records/lesson_plans.json';
  }

  getContentRecordsUrl() {
    return this.serverUrl + '/api/v2/content_records.json';
  }

  getTeacherTeachingPlansUrl() {
    return this.serverUrl + '/api/v2/teaching_plans.json';
  }

  getDailyFrequencyStudentsUpdateOrCreateUrl() {
    return (
      this.serverUrl + '/api/v2/daily_frequency_students/update_or_create.json'
    );
  }

  getContentRecordsSyncUrl() {
    return this.serverUrl + '/api/v2/content_records/sync.json';
  }

  getObservationDiaryRecordsUrl() {
    return this.serverUrl + '/api/v2/observation_diary_records.json';
  }

  getObservationDiaryRecordsSyncUrl() {
    return this.serverUrl + '/api/v2/observation_diary_records/sync.json';
  }

  getAvaliationsUrl() {
    return this.serverUrl + '/api/v2/avaliations.json';
  }

  getDailyNotesSyncUrl() {
    return this.serverUrl + '/api/v2/daily_notes/sync.json';
  }

  getAllHostsUrl() {
    return environment.app.cities_url;
  }
}
