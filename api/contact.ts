// API functions för kontaktformulär
export interface ContactFormData {
  name: string;
  company: string;
  email: string;
  message: string;
}

export interface ApiResponse {
  ok: boolean;
  json?: any;
  error?: string;
}

function discoverApiBaseUrl(explicit?: string): string {
  if (explicit) return explicit;
  
  if (typeof window !== 'undefined') {
    const w = window as unknown as { API_BASE_URL?: string };
    if (w && typeof w.API_BASE_URL === 'string' && w.API_BASE_URL) {
      return w.API_BASE_URL;
    }
  }
  
  return 'https://devapi.blimpify-im.com/api';
}

export async function sendEmailForm(toAddress: string, data: ContactFormData): Promise<ApiResponse> {
  const apiBaseUrl = discoverApiBaseUrl();
  
  try {
    const response = await fetch(`${apiBaseUrl}/contact/send-email-form`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...data, toAddress }),
    });
    
    const json = await response.json();
    
    if (!response.ok) {
      return { ok: false, error: json.message || 'Failed to send email' };
    }
    
    return { ok: true, json };
  } catch (error: any) {
    console.error('Error in sendEmailForm:', error);
    return { ok: false, error: error.message || 'Network error' };
  }
}
