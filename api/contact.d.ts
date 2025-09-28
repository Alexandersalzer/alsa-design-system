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
export declare function sendEmailForm(toAddress: string, data: ContactFormData): Promise<ApiResponse>;
