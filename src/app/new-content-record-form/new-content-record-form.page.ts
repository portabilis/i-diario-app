import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Classroom } from '../data/classroom.interface';
import { Unity } from '../data/unity.interface';
import { ClassroomsService } from '../services/classrooms';
import { DisciplinesService } from '../services/disciplines';
import { UtilsService } from '../services/utils';
import { MessagesService } from "../services/messages";

@Component({
  selector: 'app-new-content-record-form',
  templateUrl: './new-content-record-form.page.html',
  styleUrls: ['./new-content-record-form.page.scss'],
  standalone: false,
})
export class NewContentRecordFormPage implements OnInit {
  unities: Unity[] = [];
  unityId: number | null = null;
  classrooms: Classroom[] = [];
  classroomId: number | null = null;
  date: any;
  disciplines: any;
  disciplineId: number | null = null;
  currentDate: Date = new Date();

  constructor(
    private route: ActivatedRoute,
    private classroomsService: ClassroomsService,
    private disciplinesService: DisciplinesService,
    private messages: MessagesService,
    private router: Router,
    private utilsService: UtilsService,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.unityId = params['unityId'];
      this.date = params['date'];

      if (!this.date) {
        this.date = this.utilsService.toStringWithoutTime(
          this.utilsService.getCurrentDate(),
        );
      }
    });

    const state = this.router.getCurrentNavigation()?.extras.state;

    if (state && state['unities']) {
      this.unities = state['unities'];
    }
  }

  onChangeUnity() {
    if (!this.unityId) {
      this.resetSelectedValues();
      return;
    }

    this.classroomsService.getOfflineClassrooms(this.unityId).subscribe({
      next: (classrooms: any) => {
        this.resetSelectedValues();
        this.classrooms = classrooms.data;
        this.disciplines = [];
      },
      error: (err: any) => {
        this.classrooms = [];
        this.disciplines = [];
        this.messages.showError(err, 'Erro');
      },
    });
  }

  onChangeClassroom() {
    if (!this.classroomId) return;

    this.disciplineId = null;

    this.disciplinesService.getOfflineDisciplines(this.classroomId).subscribe({
      next: (result: any) => {
        this.disciplines = result.data;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  submitNewContentRecord(form: NgForm) {
    const unityId = form.value.unity;
    const unityName =
      this.unities.find((d) => d.id === unityId)?.description || '';
    const classroomId = form.value.classroom;
    const selectedClassroom = this.classrooms.find((d) => d.id === classroomId);
    const gradeId = selectedClassroom?.grade_id;
    const classroomDescription = selectedClassroom?.description || '';
    const date = this.utilsService.dateToTimezone(form.value.date);
    const stringDate = this.utilsService.toStringWithoutTime(date);
    const disciplineId = form.value.discipline;
    const disciplineDescription =
      this.disciplines.find((d: { id: any }) => d.id === disciplineId)
        ?.description || '';

    const navigationExtras = {
      queryParams: {
        date: stringDate,
        unityId: unityId,
        disciplineId: disciplineId,
        classroomId: classroomId,
        gradeId: gradeId,
        description: disciplineDescription,
        classroomName: classroomDescription,
        unityName: unityName,
      },
    };

    // Navegar para a próxima página, passando parâmetros via queryParams
    this.router.navigate(['/content-record-form'], navigationExtras);
  }

  resetSelectedValues() {
    this.classroomId = null;
    this.disciplineId = null;
  }

  goBack() {
    this.router.navigate(['/tabs/tab2']);
  }
}
