import { EventFormValues } from '../schemas/event.schema';
import { Event } from '../types';
import client from './client';

function assertArrayResponse<T>(data: unknown, endpoint: string): T[] {
  if (!Array.isArray(data)) {
    throw new Error(`Invalid response from ${endpoint}: expected an array.`);
  }
  return data as T[];
}

function assertObjectResponse<T>(data: unknown, endpoint: string): T {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error(`Invalid response from ${endpoint}: expected an object.`);
  }
  return data as T;
}

export const eventsApi = {
  list: (params?: Record<string, string>) =>
    client
      .get<unknown>('/events', { params })
      .then((response) => assertArrayResponse<Event>(response.data, '/events')),

  getOne: (id: number) =>
    client
      .get<unknown>(`/events/${id}`)
      .then((response) => assertObjectResponse<Event>(response.data, `/events/${id}`)),

  create: (data: EventFormValues) =>
    client
      .post<unknown>('/events', data)
      .then((response) => assertObjectResponse<Event>(response.data, '/events')),

  update: (id: number, data: EventFormValues) =>
    client
      .put<unknown>(`/events/${id}`, data)
      .then((response) => assertObjectResponse<Event>(response.data, `/events/${id}`)),

  remove: (id: number) =>
    client.delete<{ message: string }>(`/events/${id}`).then((response) => response.data),
};
