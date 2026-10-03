/**
 * JSON API client for the React SPA.
 * Uses cookie sessions — always send credentials so express-session cookies work
 * through the Vite `/api` proxy (dev) and same-origin Express (prod).
 */

export interface User {
    Id: string;
    WhenCreated: string;
    WhenUpdated: string;
    Email: string;
    Username: string;
    Verified: boolean;
    Admin: boolean;
    Active: boolean;
}

export interface ApiResponse<T = unknown> {
    IsSuccess: boolean;
    Message?: string;
    Data?: T;
}

export class ApiError extends Error {
    status: number;
    body: ApiResponse;

    constructor(status: number, body: ApiResponse) {
        super(body.Message || `Request failed with status ${status}`);
        this.name = "ApiError";
        this.status = status;
        this.body = body;
    }
}

export async function apiFetch<T = unknown>(
    path: string,
    init: RequestInit = {}
): Promise<ApiResponse<T>> {
    const headers = new Headers(init.headers);

    if (init.body && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    const response = await fetch(path, {
        ...init,
        headers,
        credentials: "include"
    });

    const body = (await response.json()) as ApiResponse<T>;

    if (!response.ok || !body.IsSuccess) {
        throw new ApiError(response.status, body);
    }

    return body;
}

export const authApi = {
    me: () => apiFetch<User>("/api/auth/me"),
    login: (email: string, password: string) =>
        apiFetch<User>("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password })
        }),
    logout: () =>
        apiFetch("/api/auth/logout", {
            method: "POST"
        }),
    requestPasswordReset: (email: string) =>
        apiFetch("/api/auth/password-reset/request", {
            method: "POST",
            body: JSON.stringify({ email })
        }),
    resetPassword: (token: string, password: string, passwordRepeat: string) =>
        apiFetch(`/api/auth/password-reset/reset?token=${encodeURIComponent(token)}`, {
            method: "POST",
            body: JSON.stringify({ password, passwordRepeat })
        }),
    verify: (token: string, password: string, passwordRepeat: string) =>
        apiFetch(`/api/auth/verify?token=${encodeURIComponent(token)}`, {
            method: "POST",
            body: JSON.stringify({ password, passwordRepeat })
        }),
    requestVerificationToken: (email: string) =>
        apiFetch("/api/auth/verification-token/request", {
            method: "POST",
            body: JSON.stringify({ email })
        })
};
