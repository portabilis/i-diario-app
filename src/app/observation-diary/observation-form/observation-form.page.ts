import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from "../../services/storage.service";
import { Classroom, Discipline, ObservationDiary, Unity } from "../../data/types";

@Component({
  selector: 'app-observation-form',
  templateUrl: './observation-form.page.html',
  styleUrls: ['./observation-form.page.scss'],
  standalone: false,
})
export class ObservationFormPage implements OnInit {
  diaryId?: number;
  isEditMode = false;
  unityId: number | null = null;
  classroomId?: number;
  disciplineId?: number;
  recordDate = '';
  students: any[] = [];
  maxDate: string;
  unities: Unity[] = [];
  classrooms: Classroom[] = [];
  disciplines: Discipline[] = [];
  diary?: ObservationDiary;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storage: StorageService,
  ) {
    const today = new Date();
    this.maxDate = today.toISOString().split('T')[0];
  }

  async ngOnInit() {
    if (!this.unities || !this.unities.length) {
      this.unities = await this.storage.get('unities');
    }

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.diaryId = parseInt(id, 10);
      this.isEditMode = true;
      await this.loadDiary();
    }
  }

  async loadDiary() {
    if (!this.diaryId) {
      return;
    }

    const observations = await this.storage.getObservationDiaries();

    const diary = observations[this.diaryId];

    if (diary) {
      const students = await this.storage.getStudentsFrom(diary.classroom_id, diary.discipline_id);

      this.diary = {
        ...diary,
        students: Object.values(students).map((student: any) => ({
          note: diary.students.find((s) => s.student.id === student.id)?.note,
          student,
        })),
      };
      this.students = diary.students;
    }
  }

  async onChangeUnity() {
    this.classroomId = undefined;
    this.disciplineId = undefined;
    this.disciplines = [];
    this.students = [];

    if (!this.unityId) {
      return;
    }

    this.classrooms = Object.values(await this.storage.getClassrooms(this.unityId));
  }

  async onChangeClassroom() {
    if (!this.classroomId) {
      return;
    }

    this.disciplineId = undefined;
    this.disciplines = Object.values(await this.storage.getDisciplines(this.classroomId));
  }

  async createOrUpdateRecord() {
    await this.loadStudents();
  }

  async loadStudents() {
    if (!this.classroomId || !this.disciplineId) {
      return;
    }

    this.isEditMode = false;

    const students = await this.storage.getStudentsFrom(this.classroomId, this.disciplineId);

    const observations = await this.storage.getObservationDiaries();

    const diary = Object.values(observations).find((o) => o.classroom_id === this.classroomId && o.discipline_id === this.disciplineId && o.record_date === this.recordDate.substring(0, 10));

    if (diary) {
      this.diaryId = diary.id;
      this.isEditMode = true;

      return await this.loadDiary();
    }

    this.diary = {
      id: Math.ceil(Math.random() * 10000000),
      classroom_id: this.classroomId,
      discipline_id: this.disciplineId,
      classroom: this.classrooms.find((c) => c.id === this.classroomId) as Classroom,
      discipline: this.disciplines.find((d) => d.id === this.disciplineId) as Discipline,
      record_date: this.recordDate.substring(0, 10),
      students: Object.values(students).map((student: any) => ({
        note: undefined,
        student,
      })),
      synced: false,
    };

    this.students = this.diary.students;
  }

  /**
   * Volta para a tela principal. Se estava cadastrando ou editando, salva no storage antes de sair da tela.
   */
  async goBack() {
    if (this.diary) {
      await this.storage.saveObservationDiaries(this.diary)
    }

    await this.router.navigate(['/tabs/observation-diary']);
  }
}
