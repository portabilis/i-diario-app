import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Unity, Classroom, Discipline, ObservationDiary } from "../data/types";

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private initialized = false;

  constructor(private storage: Storage) {}

  async init() {
    if (this.initialized) {
      return;
    }

    this.initialized = true;
    await this.storage.create();
    await this.initializeDefaultData();
  }

  // TODO verificar
  // Algumas das estruturas abaixo não condizem com uma listagem (array)
  private async initializeDefaultData() {
    const defaults = {
      classrooms: [],
      contentLessonPlans: [],
      contentRecords: [],
      disciplines: [],
      examRules: [],
      // frequencies: null,
      // lessonPlans: null,
      schoolCalendars: [],
      students: [],
      // teachingPlans: null,
      unities: [],
      user: null,
    };

    for (const [key, value] of Object.entries(defaults)) {
      const existingValue = await this.storage.get(key);

      if (existingValue === null) {
        await this.storage.set(key, value);
      }
    }
  }

  async set(key: string, value: any) {
    await this.storage.set(key, value);
  }

  async get(key: string) {
    return await this.storage.get(key);
  }

  async remove(key: string) {
    await this.storage.remove(key);
  }

  async clear() {
    await this.storage.clear();
  }

  /**
   * Retorna as unidades em um hash `{ [id]: unity }`.
   */
  async getUnities(): Promise<Record<number, Unity>[]> {
    const unitiesFromStorage = await this.storage.get('unities') || [];

    return unitiesFromStorage
      .reduce((unitiesObject: object, unity: { id: number }) => ({
        ...unitiesObject,
        [unity.id]: unity,
      }), {});
  }

  /**
   * Retorna as turmas em um hash `{ [id]: classroom }`. Se informado `unity` retorna apenas as turmas da escola.
   */
  async getClassrooms(unity?: number): Promise<Classroom[]> {
    const unities = await this.getUnities();
    const classroomsFromStorage = await this.storage.get('classrooms') || [];

    return classroomsFromStorage
      .filter((u: { unityId: number }) => !unity || unity === u.unityId)
      .flatMap((u: { unityId: number; data: { id: any }[] }) => u.data.map((c) => ({ ...c, unity_id: u.unityId })))
      .reduce((classroomsObject: object, classroom: Classroom) => ({
        ...classroomsObject,
        [classroom.id]: {
          ...classroom,
          unity: unities[classroom.unity_id],
        },
      }), {});
  }

  /**
   * Retorna as disciplinas em um hash `{ [id]: discipline }`. Se informado `classroom` retorna apenas as disciplinas da
   * turma.
   */
  async getDisciplines(classroom?: number): Promise<Discipline[]> {
    const disciplinesFromStorage = await this.storage.get('disciplines') || [];

    return disciplinesFromStorage
      .filter((c: { classroomId: number, data: { id: any }[] }) => !classroom || c.classroomId === classroom)
      .flatMap((c: { data: { id: any }[] }) => c.data)
      .reduce((disciplinesObject: object, discipline: Discipline) => ({
        ...disciplinesObject,
        [discipline.id]: discipline,
      }), {});
  }

  /**
   * Retorna as observações diárias em um hash `{ [id]: observation }`.
   */
  async getObservationDiaries(): Promise<ObservationDiary[]> {
    const observationDiariesFromStorage = await this.storage.get('observationDiaries') || [];
    const classroomsFromStorage = await this.getClassrooms();
    const disciplinesFromStorage = await this.getDisciplines();
    const studentsFromStorage = await this.getStudents();

    return observationDiariesFromStorage
      .reduce((observationsObject: object, observation: any) => ({
        ...observationsObject,
        [observation.id]: {
          ...observation,
          classroom: classroomsFromStorage[observation.classroom_id],
          discipline: disciplinesFromStorage[observation.discipline_id],
          students: observation.students.map((s: { student_id: number; observation: string }) => ({
            note: s.observation,
            student: studentsFromStorage[s.student_id],
          })),
        },
      }), {});
  }

  /**
   * Retorna os alunos de uma turma/disciplina em um hash `{ [id]: student }`.
   */
  async getStudentsFrom(classroom: number, discipline: number) {
    const studentsInClassroomDiscipline = await this.storage.get('students') || [];

    const students = studentsInClassroomDiscipline.find((item: any) => item.classroomId == classroom && item.disciplineId == discipline);

    if (!students) {
      return {};
    }

    return students.data.classroom_students
      .reduce((studentsObject: object, classroomStudents: any) => ({
        ...studentsObject,
        [classroomStudents.student.id]: {
          id: classroomStudents.student.id,
          registration_id: classroomStudents.id,
          name: classroomStudents.student.name,
          active: classroomStudents.active,
          status: classroomStudents.status,
          sequence: classroomStudents.sequence,
        },
      }), {});
  }

  /**
   * Retorna todos os alunos em um hash `{ [id]: student }`.
   */
  async getStudents() {
    const studentsFromStorage = await this.storage.get('students') || [];

    return studentsFromStorage
      .flatMap((studentsObject: any) => studentsObject.data.classroom_students)
      .reduce((studentsObject: object, classroomStudents: any) => ({
        ...studentsObject,
        [classroomStudents.student.id]: {
          id: classroomStudents.student.id,
          registration_id: classroomStudents.id,
          name: classroomStudents.student.name,
          active: classroomStudents.active,
          status: classroomStudents.status,
          sequence: classroomStudents.sequence,
        },
      }), {});
  }

  /**
   * Salva no storage um diário de observação para ser sincronizado.
   */
  async saveObservationDiaries(observation: ObservationDiary) {
    const observationToSave = {
      id: observation.id,
      classroom_id: observation.classroom.id,
      classroom_name: observation.classroom.description,
      discipline_id: observation.discipline.id,
      discipline_name: observation.discipline.description,
      record_date: observation.record_date,
      synced: false, // TODO: refatorar para sincronizar apenas se os dados foram atualizados
      students: observation.students.map((s) => ({
        observation: s.note,
        student_id: s.student.id,
        student_name: s.student.name,
      })),
      created_at: null,
      updated_at: null,
    };

    const observationDiaries = await this.storage.get('observationDiaries') || [];

    const filteredObservationDiaries = observationDiaries.filter((o: ObservationDiary) => {
      if (o.id === observationToSave.id) {
        return false;
      }

      if (o.classroom_id === observationToSave.classroom_id && o.discipline_id === observationToSave.discipline_id && o.record_date === observationToSave.record_date) {
        return false;
      }

      return true;
    });

    filteredObservationDiaries.push(observationToSave);

    await this.storage.set('observationDiaries', filteredObservationDiaries);
  }
}
