function discoverApiBaseUrl(explicit) {
    if (explicit)
        return explicit;
    if (typeof window !== 'undefined') {
        const w = window;
        if (w && typeof w.API_BASE_URL === 'string' && w.API_BASE_URL) {
            return w.API_BASE_URL;
        }
    }
    return 'https://devapi.blimpify-im.com/api';
}
export async function sendEmailForm(toAddress, data) {
    const apiBaseUrl = discoverApiBaseUrl();
    try {
        const response = await fetch(`${apiBaseUrl}/contact/send-email-form`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(Object.assign(Object.assign({}, data), { toAddress })),
        });
        const json = await response.json();
        if (!response.ok) {
            return { ok: false, error: json.message || 'Failed to send email' };
        }
        return { ok: true, json };
    }
    catch (error) {
        console.error('Error in sendEmailForm:', error);
        return { ok: false, error: error.message || 'Network error' };
    }
}
