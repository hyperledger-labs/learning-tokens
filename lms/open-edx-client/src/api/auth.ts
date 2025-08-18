import { client } from './client';
import { AccessTokenResponse } from '../interfaces/types';

const CLIENT_ID = process.env.OAUTH_CLIENT_ID!;
const CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET!;

export async function authenticate(): Promise<void> {
  const payload = new URLSearchParams();
  payload.append('client_id', CLIENT_ID);
  payload.append('client_secret', CLIENT_SECRET);
  payload.append('grant_type', 'client_credentials');

  const response = await client.post<AccessTokenResponse>(
    '/oauth2/access_token',
    payload,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  const token = response.data.access_token;
  client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
