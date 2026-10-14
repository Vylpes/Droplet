/**
 * JSON API client for the React SPA.
 * Uses cookie sessions — always send credentials so express-session cookies work
 * through the Vite `/api` proxy (dev) and same-origin Express (prod).
 */

import type {
    IBasicResponse,
    ItemDto,
    ItemPurchaseDto,
    NoteDto,
    SupplyDto,
    SupplyPurchaseDto,
    UserDto
} from "@droplet/shared";

export type { UserDto as User } from "@droplet/shared";
export type ApiResponse<T = unknown> = IBasicResponse<T>;

export class ApiError extends Error {
    status: number;
    body: ApiResponse;

    constructor(status: number, body: ApiResponse) {
        super(body.Message || `Request failed with status ${status}`);
        this.name = "ApiError";
        this.status = status;
        this.body = body;
    }

    /** Field-keyed validation errors from ApiBodyValidator (#351). */
    get fieldErrors(): Record<string, string> | undefined {
        return this.body.Errors;
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
    me: () => apiFetch<UserDto>("/api/auth/me"),
    login: (email: string, password: string) =>
        apiFetch<UserDto>("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password })
        }),
    logout: () =>
        apiFetch("/api/auth/logout", {
            method: "POST"
        }),
    checkAdminRegister: () => apiFetch("/api/auth/admin-register"),
    adminRegister: (
        username: string,
        email: string,
        password: string,
        passwordRepeat: string
    ) =>
        apiFetch<UserDto>("/api/auth/admin-register", {
            method: "POST",
            body: JSON.stringify({ username, email, password, passwordRepeat })
        }),
    validateVerifyToken: (token: string) =>
        apiFetch<UserDto>(
            `/api/auth/verify?token=${encodeURIComponent(token)}`
        ),
    verify: (token: string, password: string, passwordRepeat: string) =>
        apiFetch<UserDto>(
            `/api/auth/verify?token=${encodeURIComponent(token)}`,
            {
                method: "POST",
                body: JSON.stringify({ password, passwordRepeat })
            }
        ),
    requestPasswordReset: (email: string) =>
        apiFetch("/api/auth/password-reset/request", {
            method: "POST",
            body: JSON.stringify({ email })
        }),
    validateResetToken: (token: string) =>
        apiFetch<UserDto>(
            `/api/auth/password-reset/reset?token=${encodeURIComponent(token)}`
        ),
    resetPassword: (token: string, password: string, passwordRepeat: string) =>
        apiFetch<UserDto>(
            `/api/auth/password-reset/reset?token=${encodeURIComponent(token)}`,
            {
                method: "POST",
                body: JSON.stringify({ password, passwordRepeat })
            }
        ),
    requestVerificationToken: (email: string) =>
        apiFetch("/api/auth/verification-token/request", {
            method: "POST",
            body: JSON.stringify({ email })
        })
};

export interface AccountUpdatePayload {
    email: string;
    username: string;
    currentPassword: string;
    newPassword?: string;
    passwordConfirm?: string;
}

export const settingsApi = {
    getAccount: () => apiFetch<UserDto>("/api/settings/account"),
    updateAccount: (payload: AccountUpdatePayload) =>
        apiFetch<UserDto>("/api/settings/account", {
            method: "POST",
            body: JSON.stringify(payload)
        })
};

export interface PurchaseViewData<TPurchase> {
    Purchase: TPurchase;
    Notes: NoteDto[];
}

export interface ItemViewData {
    Item: ItemDto;
    Notes: NoteDto[];
}

export interface SupplyViewData {
    Supply: SupplyDto;
    Notes: NoteDto[];
}

export interface PurchaseCreatePayload {
    description: string;
    price: number;
}

export interface PurchaseUpdatePayload {
    description: string;
    price: number;
}

export interface PurchaseStatusPayload {
    status: number;
}

export interface AddNotePayload {
    text: string;
}

export interface ItemCreatePayload {
    name: string;
    quantity: number;
    purchaseId: string;
}

export interface ItemUpdatePayload {
    name: string;
}

export interface ItemQuantityPayload {
    unlisted: number;
    listed: number;
    sold: number;
    rejected: number;
}

export interface SupplyCreatePayload {
    name: string;
    sku: string;
    quantity: number;
    purchaseId: string;
}

export interface SupplyUpdatePayload {
    name: string;
    sku: string;
}

export interface SupplyQuantityPayload {
    unused: number;
    used: number;
}

export const itemPurchasesApi = {
    list: (status: string) =>
        apiFetch<ItemPurchaseDto[]>(`/api/item-purchases/${status}`),
    get: (id: string) =>
        apiFetch<PurchaseViewData<ItemPurchaseDto>>(
            `/api/item-purchases/view/${id}`
        ),
    create: (payload: PurchaseCreatePayload) =>
        apiFetch<ItemPurchaseDto>("/api/item-purchases/new", {
            method: "POST",
            body: JSON.stringify(payload)
        }),
    update: (id: string, payload: PurchaseUpdatePayload) =>
        apiFetch<ItemPurchaseDto>(`/api/item-purchases/view/${id}/update`, {
            method: "POST",
            body: JSON.stringify(payload)
        }),
    updateStatus: (id: string, payload: PurchaseStatusPayload) =>
        apiFetch<ItemPurchaseDto>(
            `/api/item-purchases/view/${id}/update-status`,
            {
                method: "POST",
                body: JSON.stringify(payload)
            }
        ),
    addNote: (id: string, payload: AddNotePayload) =>
        apiFetch<NoteDto>(`/api/item-purchases/${id}/add-note`, {
            method: "POST",
            body: JSON.stringify(payload)
        })
};

export const itemsApi = {
    get: (itemId: string) =>
        apiFetch<ItemViewData>(`/api/items/${itemId}`),
    create: (payload: ItemCreatePayload) =>
        apiFetch<ItemDto>("/api/items/new", {
            method: "POST",
            body: JSON.stringify(payload)
        }),
    update: (itemId: string, payload: ItemUpdatePayload) =>
        apiFetch<ItemDto>(`/api/items/${itemId}/update`, {
            method: "POST",
            body: JSON.stringify(payload)
        }),
    updateQuantity: (itemId: string, payload: ItemQuantityPayload) =>
        apiFetch<ItemDto>(`/api/items/${itemId}/update-quantity`, {
            method: "POST",
            body: JSON.stringify(payload)
        }),
    addNote: (itemId: string, payload: AddNotePayload) =>
        apiFetch<NoteDto>(`/api/items/${itemId}/add-note`, {
            method: "POST",
            body: JSON.stringify(payload)
        })
};

export const supplyPurchasesApi = {
    list: (status: string) =>
        apiFetch<SupplyPurchaseDto[]>(`/api/supply-purchases/${status}`),
    get: (id: string) =>
        apiFetch<PurchaseViewData<SupplyPurchaseDto>>(
            `/api/supply-purchases/view/${id}`
        ),
    create: (payload: PurchaseCreatePayload) =>
        apiFetch<SupplyPurchaseDto>("/api/supply-purchases/new", {
            method: "POST",
            body: JSON.stringify(payload)
        }),
    update: (id: string, payload: PurchaseUpdatePayload) =>
        apiFetch<SupplyPurchaseDto>(`/api/supply-purchases/view/${id}/update`, {
            method: "POST",
            body: JSON.stringify(payload)
        }),
    updateStatus: (id: string, payload: PurchaseStatusPayload) =>
        apiFetch<SupplyPurchaseDto>(
            `/api/supply-purchases/view/${id}/update-status`,
            {
                method: "POST",
                body: JSON.stringify(payload)
            }
        ),
    addNote: (id: string, payload: AddNotePayload) =>
        apiFetch<NoteDto>(`/api/supply-purchases/${id}/add-note`, {
            method: "POST",
            body: JSON.stringify(payload)
        })
};

export const suppliesApi = {
    get: (id: string) => apiFetch<SupplyViewData>(`/api/supplies/${id}`),
    create: (payload: SupplyCreatePayload) =>
        apiFetch<SupplyDto>("/api/supplies/new", {
            method: "POST",
            body: JSON.stringify(payload)
        }),
    update: (id: string, payload: SupplyUpdatePayload) =>
        apiFetch<SupplyDto>(`/api/supplies/${id}/update`, {
            method: "POST",
            body: JSON.stringify(payload)
        }),
    updateQuantity: (id: string, payload: SupplyQuantityPayload) =>
        apiFetch<SupplyDto>(`/api/supplies/${id}/update-quantity`, {
            method: "POST",
            body: JSON.stringify(payload)
        }),
    addNote: (id: string, payload: AddNotePayload) =>
        apiFetch<NoteDto>(`/api/supplies/${id}/add-note`, {
            method: "POST",
            body: JSON.stringify(payload)
        })
};