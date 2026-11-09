import type { RequestDetail, RequestSummary, RequestUpdate } from './types';
export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, { ...init, headers: { 'Content-Type': 'application/json', ...init?.headers } });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message ?? body?.title ?? `Request failed (${response.status}).`);
  }
  return response.json() as Promise<T>;
}
export const api = {
  list: () => request<RequestSummary[]>('/api/requests'),
  detail: (id: string, signal?: AbortSignal) => request<RequestDetail>(`/api/requests/${id}`, { signal }),
  save: (id: string, value: RequestUpdate) => request<RequestDetail>(`/api/requests/${id}`, { method: 'PUT', body: JSON.stringify(value) }),
  review: (id: string) => request<RequestDetail>(`/api/requests/${id}/review`, { method: 'POST' })
};
