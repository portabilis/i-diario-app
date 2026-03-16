import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, concat } from 'rxjs';
import { ApiService } from '../api';
import {
  DailyNoteApi,
} from '../../data/types';

@Injectable()
export class DailyNoteRecordsSynchronizer {
  constructor(
    private http: HttpClient,
    private api: ApiService,
  ) {}

  /**
   * Sincroniza registros pendentes de diários de observação
   */
  public sync(
    dailyNotes: DailyNoteApi[],
    teacherId: number,
  ): Observable<any> {
    return new Observable((observer) => {
      if (!dailyNotes || dailyNotes.length === 0) {
        observer.complete();
        return;
      }

      const diaryObservables = dailyNotes.map((dailyNote) => {
        const apiPayload = this.mapToApiFormat(dailyNote, teacherId);
        return this.http.post(this.api.getDailyNotesSyncUrl(), apiPayload);
      });

      concat(...diaryObservables).subscribe({
        next: (result) => observer.next(result),
        error: (error) => observer.error(error),
        complete: () => observer.complete(),
      });
    });
  }

  /**
   * Mapeia objeto local para formato da API
   */
  private mapToApiFormat(
    dailyNote: DailyNoteApi,
    teacherId: number,
  ): any {
    return {
      avaliation_id: dailyNote.id,
      teacher_id: teacherId,
      students: dailyNote.notes.map((studentNote) => ({
        student_id: studentNote.student_id,
        note: studentNote.note,
      })),
    };
  }
}
