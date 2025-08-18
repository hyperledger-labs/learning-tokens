import { client } from './client';
import { User } from '../interfaces/types';

export async function getUsers(): Promise<User[]> {
  const res = await client.get<User[]>('/api/user/v1/accounts');
  console.log('[DEBUG] getUsers response:', res.data);
  return res.data;
}


export async function getCourseCreators(): Promise<User[]> {
  const users = await getUsers();
  return users.filter(user => user.is_staff);
}
