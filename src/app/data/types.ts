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

export interface Avaliation {
  id: number;
  description: string;
  test_date: string;
  weight: number;
  grade_type: 'numeric' | 'concept';
  max_score: number;
  unity_id: number;
  unity_name: string;
  classroom_id: number;
  classroom_name: string;
  discipline_id?: number;
  discipline_name?: string;
  status: 'pending' | 'partial' | 'completed';
  total_students: number;
  graded_students: number;
}

export interface StudentDailyNote {
  id?: number;
  student_id: number;
  student_name: string;
  student_sequence: number;
  avaliation_id: number;
  grade: number | null;
  is_absent: boolean;
  is_modified: boolean;
  is_synced: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DailyNoteRecordApi {
  id: number;
  // teacher_id: number;
  classroom_id: number;
  classroom_name: number;
  unity_id: number;
  unity_name: number;
  discipline_id: number;
  discipline_name: number;
  test_date: string;
  description: string;
  weight: number;
  test_setting_id: number;
  average_calculation_type: number;
  test_setting_test_id: number;
  test_setting_test_name: number;
  grade_ids: number;
}

export interface DailyNote {
  id: number;
  classroom_id: number;
  classroom_name: string;
  unity_id: number;
  unity_name: string;
  discipline_id: number;
  discipline_name: string;
  test_date: string;
  description: string;
  weight: number;
  test_setting_id: number;
  average_calculation_type: number;
  test_setting_test_id: number;
  test_setting_test_name: number;
  max_score: number;
  synced: boolean;
  notes: DailyNoteStudent[];
}

export interface DailyNoteStudent {
  id: number;
  active: boolean;
  note?: string | number;
  student_id: number;
  student_name: string;
}

export interface DailyNoteApi {
  id: number;
  classroom_id: number;
  classroom_name: string;
  discipline_id: number;
  discipline_name: string;
  synced: boolean;
  record_date: string;
  created_at: string;
  updated_at: string;
  notes: DailyNoteStudentApi[];
  description: string,
  grade_type: string,
  max_score: number,
  status: null,
  test_date: null,
  total_students: null,
  unity_id: null,
  unity_name: null,
  weight: null,
}

export interface DailyNoteStudentApi {
  student_id: number;
  note: number | string;
}
