// src/types/index.ts

export interface Assessment {
  id: string;
  type: string;  // e.g., "quiz", "homework"
  name: string;
  due_date: string | null;
  max_score: number;
  student_score?: number;
}

export interface CourseBlock {
  id: string;
  block_id: string;
  type: string;
  display_name: string;
  children: string[];
}

export interface CourseBlockResponse {
  blocks: { [key: string]: CourseBlock };
  root: string;
}

export interface Course {
  id: string;
  name: string;
  short_description: string;
  language: string;
  start: string | null;
  end: string | null;
  pacing: "instructor" | "self";
  enrollment?: {
    mode: string;
    is_active: boolean;
  };
}

export interface Enrollment {
  created: string;
  mode: string;
  is_active: boolean;
  user: string;
  course_id: string;
}

export interface Grade {
  course_key: string;
  username: string;
  letter_grade: string | null;
  percent: number;
  passed: boolean;
}
