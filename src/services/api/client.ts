import { API_BASE_URL } from '@/config/api';

type RequestOptions = {
  accessToken?: string;
  body?: unknown;
  method?: 'GET' | 'POST' | 'PATCH';
};

type ApiErrorBody = {
  message?: string | string[];
};

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    body: options.body ? JSON.stringify(options.body) : undefined,
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.accessToken ? { Authorization: `Bearer ${options.accessToken}` } : {}),
    },
    method: options.method ?? 'GET',
  });

  const text = await response.text();
  const data: unknown = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(getApiErrorMessage(data, response.status));
  }

  return data as T;
}

function getApiErrorMessage(data: unknown, status: number) {
  if (isApiErrorBody(data)) {
    if (Array.isArray(data.message)) {
      return data.message.join(', ');
    }

    if (data.message) {
      return data.message;
    }
  }

  return `Request failed with status ${status}.`;
}

function isApiErrorBody(value: unknown): value is ApiErrorBody {
  return typeof value === 'object' && value !== null && 'message' in value;
}
