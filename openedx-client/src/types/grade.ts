// src/types/grade.ts
export interface Grade {
  course_key: string;
  username: string;
  letter_grade: string | null;
  percent: number;
  passed: boolean;
}
