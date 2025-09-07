// src/types/block.ts
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
