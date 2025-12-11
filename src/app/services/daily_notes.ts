import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { StorageService } from './storage.service';
import { ApiService } from './api';
import { Avaliation, DailyNote, DailyNoteRecordApi, StudentDailyNote } from '../data/types';
import { forkJoin, mergeMap, Observable, of } from "rxjs";
import { map } from 'rxjs/operators';
import * as _ from "lodash";

@Injectable({
  providedIn: 'root',
})
export class DailyNotesService {
  constructor(
    private storage: StorageService,
    private http: HttpClient,
    private api: ApiService,
  ) {}

  getDailyNotes(
    teacher: number,
    disciplines: any,
  ): Observable<Avaliation[]> {
    const requests: Observable<Avaliation[]>[] = [];

    disciplines.forEach((discipline: { classroomId: number; data: {id: number}[]}) => {
      discipline.data.forEach(({ id }) => {
        const params = new HttpParams()
          .set('teacher_id', teacher.toString())
          .set('classroom_id', discipline.classroomId.toString())
          .set('discipline_id', id.toString());

        const request = this.http
          .get<{ avaliations: DailyNoteRecordApi[] }>(
            this.api.getAvaliationsUrl(),
            { params },
          )
          .pipe(
            mergeMap(async (response) => {
              console.log('Response for classroom/discipline:', discipline.classroomId, id, response);
              return await this.mapFromApiFormat(response.avaliations);
            }),
          );

        requests.push(request);
      });
    });

    if (requests.length === 0) {
      return of([]);
    }

    return forkJoin(requests).pipe(
      map((results: Avaliation[][]) => results.flat()),
    );
  }

  /**
   * Mapeia dados da API para o formato local.
   */
  private async mapFromApiFormat(
    apiRecords: DailyNoteRecordApi[],
  ): Promise<Avaliation[]> {
    return await Promise.all(
      apiRecords.map(async (record: any) => {
        const students = record.daily_note?.students || [];
        const totalStudents = students.length;
        const gradedStudents = students.filter((s: any) => s.note !== null && s.note !== undefined).length;

        let status: 'pending' | 'partial' | 'completed' = 'pending';

        if (gradedStudents === totalStudents && totalStudents > 0) {
          status = 'completed';
        } else if (gradedStudents > 0) {
          status = 'partial';
        }

        return {
          id: record.id,
          description: record.description,
          test_date: record.test_date,
          weight: record.weight,
          grade_type: record.grade_type,
          max_score: 10.0, // TODO: Valor padrão, deve ser ajustado conforme necessário
          unity_id: record.unity_id,
          unity_name: record.unity_name,
          classroom_id: record.classroom_id,
          classroom_name: record.classroom_name,
          discipline_id: record.discipline_id,
          discipline_name: record.discipline_name,
          status,
          total_students: totalStudents,
          graded_students: gradedStudents,
          notes: students,
          synced: true, // Registro sempre estará sincronizado quando vier da API
        };
      }),
    );
  }

  /**
   * Carrega todas as avaliações do storage.
   */
  async getAllAvaliations() {
    const dailyNotes = await this.storage.getDailyNotes();
    const unities = await this.storage.getUnities();
    const classrooms = await this.storage.getClassrooms();
    const allDailyNotes = Object.values(dailyNotes);

    const grouped = _.mapValues(
      _.groupBy(_.sortBy(allDailyNotes, 'test_date'), 'test_date'),
      group => {
        const sorted = _.sortBy(group, (dailyNote: DailyNote) => classrooms[dailyNote.classroom_id].unity.description);
        const grouped = _.groupBy(sorted, (dailyNote: DailyNote) => classrooms[dailyNote.classroom_id].unity.id);

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

  async getDailyNote(id: number): Promise<DailyNote> {
    const dailyNotes = await this.storage.getDailyNotes();

    return dailyNotes[id] || {};
  }

  /**
   * Formata uma data no formato brasileiro.
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
}
