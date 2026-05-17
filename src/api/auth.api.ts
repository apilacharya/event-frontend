import { User } from '../types';
import client from './client';

export const authApi = {
  signup: (data: { name: string; email: string; password: string }) =>
    client.post<{ user: User }>('/auth/signup', data).then((response) => response.data),

  login: (data: { email: string; password: string }) =>
    client.post<{ user: User }>('/auth/login', data).then((response) => response.data),

  logout: () => client.post<{ message: string }>('/auth/logout').then((response) => response.data),

  me: () => client.get<{ user: User }>('/auth/me').then((response) => response.data),
};
