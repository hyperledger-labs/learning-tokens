export interface CourseDetails {
  id: string;
  name: string;
  org: string;
  overview: string;
  [key: string]: any;
}
export interface User {
  username: string;
  email: string;
  full_name: string;
  is_active: boolean;
}

export interface Enrollment {
  course_id: string;
  user: string;
  mode: string;
  is_active: boolean;
}

export interface Grade {
  passed: boolean;
  percent: number;
  letter_grade: string;
}
// src/interfaces/Assessment.ts
export interface Assessment {
  id: string;
  name: string;
  due: string | null;
  graded: boolean;
}

