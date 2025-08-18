import { client } from './client';
import { Certificate } from '../interfaces/types';

export async function getCertificates(courseId: string): Promise<Certificate[]> {
  const res = await client.get<{ results: Certificate[] }>(`/api/certificates/v0/certificates/${courseId}/`);
  return res.data.results;
}
