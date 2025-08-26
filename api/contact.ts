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

// Skicka email direkt till angiven mottagare
export async function sendEmailForm(toAddress: string, data: ContactFormData): Promise<ApiResponse> {
  const apiBaseUrl = discoverApiBaseUrl();

  try {
    const response = await fetch(`${apiBaseUrl}/contact/send-email-form`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        toAddress,
        ...data
      }),
    });

    if (!response.ok) {
      return {
        ok: false,
        error: `HTTP error! status: ${response.status}`
      };
    }

    const json = await response.json();
    return {
      ok: true,
      json
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Universal kontaktformulär - identifierar kund automatiskt via domän
export async function sendEmailFormUniversal(data: ContactFormData): Promise<ApiResponse> {
  const apiBaseUrl = discoverApiBaseUrl();

  try {
    console.log('🌍 Skickar universellt kontaktformulär för current domain:', typeof window !== 'undefined' ? window.location.host : 'unknown');
    
    const response = await fetch(`${apiBaseUrl}/contact/send-email-form-universal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      return {
        ok: false,
        error: `HTTP error! status: ${response.status}`
      };
    }

    const json = await response.json();
    return {
      ok: true,
      json
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
