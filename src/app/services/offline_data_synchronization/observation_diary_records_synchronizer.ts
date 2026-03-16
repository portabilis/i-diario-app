import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, concat } from 'rxjs';
import { ApiService } from '../api';
import {
  ObservationDiaryApi,
} from '../../data/types';

@Injectable()
export class ObservationDiaryRecordsSynchronizer {
  constructor(
    private http: HttpClient,
    private api: ApiService,
  ) {}

  /**
   * Sincroniza registros pendentes de diários de observação
   */
  public sync(
    diaries: ObservationDiaryApi[],
    teacherId: number,
  ): Observable<any> {
    return new Observable((observer) => {
      if (!diaries || diaries.length === 0) {
        observer.complete();
        return;
      }

      const diaryObservables = diaries.map((diary) => {
        const apiPayload = this.mapToApiFormat(diary, teacherId);
        return this.http.post(this.api.getObservationDiaryRecordsSyncUrl(), apiPayload);
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
    diary: ObservationDiaryApi,
    teacherId: number,
  ): any {
    // Agrupa observações por descrição única
    const notesMap = new Map<string, number[]>();

    diary.students.forEach((student) => {
      if (student.observation && student.observation.trim()) {
        const description = student.observation.trim();
        if (!notesMap.has(description)) {
          notesMap.set(description, []);
        }
        notesMap.get(description)!.push(student.student_id);
      }
    });

    return {
      id: diary.id,
      teacher_id: teacherId,
      classroom_id: diary.classroom_id,
      classroom_name: diary.classroom_name,
      discipline_id: diary.discipline_id,
      discipline_name: diary.discipline_name,
      date: diary.record_date,
      notes: diary.students.filter((s) => !!s.observation).map((s) => ({
        description: s.observation,
        student_ids: [s.student_id],
      })),
    };
  }
}
