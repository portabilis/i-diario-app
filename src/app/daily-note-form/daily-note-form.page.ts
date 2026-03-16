import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DailyNotesService } from '../services/daily_notes';
import { DailyNote, DailyNoteStudent, Student, StudentDailyNote } from '../data/types';
import { StorageService } from "../services/storage.service";

@Component({
  selector: 'app-daily-note-form',
  templateUrl: './daily-note-form.page.html',
  styleUrls: ['./daily-note-form.page.scss'],
  standalone: false,
})
export class DailyNoteFormPage implements OnInit {
  unityId!: number;
  classroomId!: number;
  avaliationId!: number;

  avaliation: DailyNote = {} as DailyNote;
  students: StudentDailyNote[] = [];

  hasUnsavedChanges = false;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dailyNotesService: DailyNotesService,
    private storage: StorageService,
  ) {}

  async ngOnInit() {
    this.avaliationId = +this.route.snapshot.paramMap.get('avaliationId')!;

    const avaliation = await this.dailyNotesService.getDailyNote(this.avaliationId);
    const students = await this.storage.getStudentsFrom(avaliation.classroom_id, avaliation.discipline_id);

    const notes: Record<number, DailyNoteStudent> = avaliation.notes.reduce((prev, current) => ({ ...prev, [current.student_id]: current }), {});

    this.avaliation = {
      ...avaliation,
      notes: Object.values(students).map((student: Student) => ({
        active: notes[student.id]?.active || true,
        id: notes[student.id]?.id || 0,
        note: notes[student.id]?.note || undefined,
        student_id: student.id,
        student_name: student.name,
      })),
    };
  }

  async goBack() {
    await this.storage.saveDailyNote(this.avaliation)
    await this.router.navigate(['/tabs/tab6']);
  }
}
