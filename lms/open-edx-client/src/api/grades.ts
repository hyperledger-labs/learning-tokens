import { client } from './client';
import { Grade } from '../interfaces/types';

export async function getGrades(courseId: string): Promise<Grade[]> {
  const res = await client.get<Grade[]>(`/api/grades/v1/gradebook/${courseId}/`);
  return res.data;
}
