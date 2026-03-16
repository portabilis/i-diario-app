import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, mergeMap } from 'rxjs';
import { StorageService } from './storage.service';
import { ApiService } from './api';
import {
  ObservationDiaryApi,
  StudentObservationApi,
  ObservationDiaryRecordApi,
} from '../data/types';
import * as _ from "lodash";

@Injectable({
  providedIn: 'root',
})
export class ObservationDiaryService {
  constructor(
    private storage: StorageService,
    private http: HttpClient,
    private api: ApiService,
  ) {}

  async groupDiariesByDateAndUnity() {
    const unities = await this.storage.getUnities();
    const classrooms = await this.storage.getClassrooms();
    const diaries = await this.storage.getObservationDiaries();
    const allDiaries = Object.values(diaries);

    const grouped = _.mapValues(
      _.groupBy(_.sortBy(allDiaries, 'record_date'), 'record_date'),
      group => {
        const sorted = _.sortBy(group, daily => classrooms[daily.classroom_id].unity.description);
        const grouped = _.groupBy(sorted, daily => classrooms[daily.classroom_id].unity.id);

        return Object.entries(grouped).map(([unityId, diaries]) => ({
          unity: unities[Number(unityId)],
          diaries,
        }));
      }
    );

    return Object.entries(grouped).reverse().map(([date, unities]) => ({
      record_date: date.split('-').reverse().join('/'),
      unities,
    }));
  }

  getObservationDiaries(
    teacherId: number,
    numberOfDays: number = 90,
  ): Observable<ObservationDiaryApi[]> {
    const params = new HttpParams()
      .set('teacher_id', teacherId.toString())
      .set('number_of_days', numberOfDays.toString());

    return this.http
      .get<{ observation_diary_records: ObservationDiaryRecordApi[] }>(
        this.api.getObservationDiaryRecordsUrl(),
        { params },
      )
      .pipe(
        mergeMap(async (response) => {
          return await this.mapFromApiFormat(response.observation_diary_records);
        }),
      );
  }

  private async mapFromApiFormat(
    apiRecords: ObservationDiaryRecordApi[],
  ): Promise<ObservationDiaryApi[]> {
    const mappedRecords = await Promise.all(
      apiRecords.map(async (record) => {
        const students: StudentObservationApi[] = [];

        for (const note of record.notes) {
          for (const student of note.students) {
            students.push({
              student_id: student.id,
              student_name: student.name,
              observation: note.description,
            });
          }
        }

        return {
          id: record.id!,
          classroom_id: record.classroom_id,
          classroom_name: record.classroom_name,
          discipline_id: record.discipline_id,
          discipline_name: record.discipline_name,
          record_date: record.date,
          created_at: record.created_at || new Date().toISOString(),
          updated_at: record.updated_at || new Date().toISOString(),
          synced: true, // Registro sempre estará sincronizado quando vier da API
          students,
        };
      }),
    );

    return mappedRecords;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  getObservationCount(diary: ObservationDiaryApi): number {
    return diary.students.filter((s) => !!s.observation).length;
  }
}
