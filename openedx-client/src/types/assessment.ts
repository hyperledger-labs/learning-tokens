// src/types/assessment.ts
export interface Assessment {
  id: string;
  type: string;  // e.g., "quiz", "homework"
  name: string;
  due_date: string | null;
  max_score: number;
  student_score?: number;
}
