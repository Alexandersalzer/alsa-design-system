/**
 * Simple API Client
 * Native fetch-based API client
 */

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T = any>(
    url: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;
    
    const response = await fetch(fullUrl, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    return {
      data,
      status: response.status,
      statusText: response.statusText,
    };
  }

  async get<T = any>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(url, { method: 'GET', ...options });
  }

  async post<T = any>(url: string, data?: any, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  async put<T = any>(url: string, data?: any, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  async delete<T = any>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(url, { method: 'DELETE', ...options });
  }
}

export const apiClient = new ApiClient(baseURL);


export default apiClient;

