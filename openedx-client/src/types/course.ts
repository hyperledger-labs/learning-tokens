// src/types/course.ts
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
