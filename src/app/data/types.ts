export interface Unity {
  description: string;
  id: number;
}

export interface Classroom {
  id: number;
  description: string;
  unity_id: number;
  grade_id: number;
  year: number;
  unity: Unity;
}

export interface Discipline {
  id: number;
  description: string;
  classroom: Classroom;
}

export interface Student {
  id: number;
  name: string;
}

export interface ObservationDiaryStudent {
  note?: string;
  student: Student;
}

export interface ObservationDiary {
  id?: number;
  classroom_id: number;
  discipline_id: number;
  classroom: Classroom;
  discipline: Discipline;
  students: ObservationDiaryStudent[];
  record_date: string;
  synced: boolean;
}
export interface ObservationDiaryApi {
  id: number;
  classroom_id: number;
  classroom_name: string;
  discipline_id: number;
  discipline_name: string;
  record_date: string;
  created_at: string;
  updated_at: string;
  synced: boolean;
  students: StudentObservationApi[];
}

export interface StudentObservationApi {
  student_id: number;
  student_name: string;
  observation: string;
}

export interface ObservationDiaryRecordApi {
  id?: number;
  teacher_id: number;
  classroom_id: number;
  classroom_name: string;
  discipline_id: number;
  discipline_name: string;
  date: string; // Format: YYYY-MM-DD
  observation_type: string;
  notes: ObservationNoteRecordApi[];
  origin?: 'WEB' | 'API_V2';
  created_at?: string;
  updated_at?: string;
}

export interface ObservationNoteRecordApi {
  id?: number;
  description: string;
  students: { id:number; name: string }[];
}
