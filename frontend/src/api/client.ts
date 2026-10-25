/**
 * JSON API client for the React SPA.
 * Uses cookie sessions — always send credentials so express-session cookies work
 * through the Vite `/api` proxy (dev) and same-origin Express (prod).
 */

import type {
    IBasicResponse,
    ItemDto,
    ItemPurchaseDto,
    ListingDto,
    NoteDto,
    OrderDto,
    PostagePolicyDto,
    ReturnDto,
    StorageDto,
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

export interface UserCreatePayload {
    username: string;
    email: string;
    /** API compares with `== "true"`; send string flags. */
    admin: string;
}

export interface UserUpdatePayload {
    username: string;
    email: string;
    /** API compares with `== "true"`; send string flags. */
    admin: string;
    active: string;
}

export const settingsApi = {
    getAccount: () => apiFetch<UserDto>("/api/settings/account"),
    updateAccount: (payload: AccountUpdatePayload) =>
        apiFetch<UserDto>("/api/settings/account", {
            method: "POST",
            body: JSON.stringify(payload)
        }),
    listUsers: () => apiFetch<UserDto[]>("/api/settings/users/"),
    getUser: (id: string) => apiFetch<UserDto>(`/api/settings/users/${id}`),
    createUser: (payload: UserCreatePayload) =>
        apiFetch<UserDto>("/api/settings/users/create", {
            method: "POST",
            body: JSON.stringify(payload)
        }),
    updateUser: (id: string, payload: UserUpdatePayload) =>
        apiFetch<UserDto>(`/api/settings/users/${id}/update`, {
            method: "POST",
            body: JSON.stringify(payload)
        }),
    toggleUserActive: (id: string) =>
        apiFetch<UserDto>(`/api/settings/users/${id}/toggle-active`)
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

export interface ListingsListData {
    Listings: ListingDto[];
    Items: ItemDto[];
}

export interface ListingViewData {
    Listing: ListingDto;
    Items: ItemDto[];
    PostagePolicies: PostagePolicyDto[];
    Notes: NoteDto[];
}

export interface ListingCreatePayload {
    listingNumber: string;
    name: string;
    itemId: string;
    price: number;
    endDate: string;
    quantity: number;
}

export interface ListingUpdatePayload {
    name: string;
    listingNumber: string;
    price: number;
    quantity: number;
}

export interface ListingRenewPayload {
    endDate: string;
}

export interface ListingAssignItemPayload {
    itemId: string;
}

export interface ListingAssignPostagePolicyPayload {
    policyId: string;
}

export interface OrdersListData {
    Orders: OrderDto[];
    Listings: ListingDto[];
    PostagePolicies: PostagePolicyDto[];
}

export interface OrderViewData {
    Order: OrderDto;
    Listings: ListingDto[];
    Supplies: SupplyDto[];
    PostagePolicies: PostagePolicyDto[];
    Notes: NoteDto[];
}

export interface OrderCreatePayload {
    orderNumber: string;
    buyer: string;
    offerAccepted: boolean | string;
    listingId: string;
    postagePolicyId: string;
    amount: number;
}

export interface OrderUpdatePayload {
    orderNumber: string;
    buyer: string;
    /** API compares with `== "true"`; send string flags. */
    offerAccepted: string;
    postagePolicyId: string;
}

export interface OrderAssignListingPayload {
    listingId: string;
    amount: number;
}

export interface OrderAssignSupplyPayload {
    supplyId: string;
    amount: number;
}

export interface OrderAssignTrackingPayload {
    number: string;
    service: number;
}

export interface OrderDiscountPayload {
    amount: number;
}

export interface ReturnsListData {
    Returns: ReturnDto[];
    Orders: OrderDto[];
}

export interface ReturnViewData {
    Return: ReturnDto;
    Notes: NoteDto[];
}

export interface ReturnCreatePayload {
    returnNumber: string;
    orderId: string;
    trackingService: number;
    trackingNumber: string;
}

export interface ReturnUpdatePayload {
    returnNumber: string;
    returnBy: string;
}

export interface ReturnStartedPayload {
    returnBy: string;
}

export interface ReturnReceivedPayload {
    returnBy: string;
}

export interface ReturnRefundPayload {
    refundAmount: number;
}

export const listingsApi = {
    list: (status: string) =>
        apiFetch<ListingsListData>(`/api/listings/${status}`),
    get: (id: string) =>
        apiFetch<ListingViewData>(`/api/listings/view/${id}`),
    create: (payload: ListingCreatePayload) =>
        apiFetch<ListingDto>("/api/listings/new", {
            method: "POST",
            body: JSON.stringify(payload)
        }),
    update: (id: string, payload: ListingUpdatePayload) =>
        apiFetch<ListingDto>(`/api/listings/view/${id}/update`, {
            method: "POST",
            body: JSON.stringify(payload)
        }),
    end: (id: string) =>
        apiFetch<ListingDto>(`/api/listings/view/${id}/end`, {
            method: "POST",
            body: JSON.stringify({})
        }),
    renew: (id: string, payload: ListingRenewPayload) =>
        apiFetch<ListingDto>(`/api/listings/view/${id}/renew`, {
            method: "POST",
            body: JSON.stringify(payload)
        }),
    assignItem: (id: string, payload: ListingAssignItemPayload) =>
        apiFetch<ListingDto>(`/api/listings/view/${id}/assign-item`, {
            method: "POST",
            body: JSON.stringify(payload)
        }),
    assignPostagePolicy: (
        id: string,
        payload: ListingAssignPostagePolicyPayload
    ) =>
        apiFetch<ListingDto>(
            `/api/listings/view/${id}/assign-postage-policy`,
            {
                method: "POST",
                body: JSON.stringify(payload)
            }
        ),
    addNote: (id: string, payload: AddNotePayload) =>
        apiFetch<NoteDto>(`/api/listings/${id}/add-note`, {
            method: "POST",
            body: JSON.stringify(payload)
        })
};

export const ordersApi = {
    list: (status: string) =>
        apiFetch<OrdersListData>(`/api/orders/${status}`),
    get: (id: string) => apiFetch<OrderViewData>(`/api/orders/view/${id}`),
    create: (payload: OrderCreatePayload) =>
        apiFetch<OrderDto>("/api/orders/new", {
            method: "POST",
            body: JSON.stringify(payload)
        }),
    update: (id: string, payload: OrderUpdatePayload) =>
        apiFetch<OrderDto>(`/api/orders/view/${id}/update`, {
            method: "POST",
            body: JSON.stringify(payload)
        }),
    paid: (id: string) =>
        apiFetch<OrderDto>(`/api/orders/view/${id}/paid`, {
            method: "POST",
            body: JSON.stringify({})
        }),
    dispatch: (id: string) =>
        apiFetch<OrderDto>(`/api/orders/view/${id}/dispatch`, {
            method: "POST",
            body: JSON.stringify({})
        }),
    discount: (id: string, payload: OrderDiscountPayload) =>
        apiFetch<OrderDto>(`/api/orders/view/${id}/discount`, {
            method: "POST",
            body: JSON.stringify(payload)
        }),
    assignListing: (id: string, payload: OrderAssignListingPayload) =>
        apiFetch<OrderDto>(`/api/orders/view/${id}/assign-listing`, {
            method: "POST",
            body: JSON.stringify(payload)
        }),
    assignSupply: (id: string, payload: OrderAssignSupplyPayload) =>
        apiFetch<OrderDto>(`/api/orders/view/${id}/assign-supply`, {
            method: "POST",
            body: JSON.stringify(payload)
        }),
    assignTrackingNumber: (
        id: string,
        payload: OrderAssignTrackingPayload
    ) =>
        apiFetch<OrderDto>(
            `/api/orders/view/${id}/assign-tracking-number`,
            {
                method: "POST",
                body: JSON.stringify(payload)
            }
        ),
    addNote: (id: string, payload: AddNotePayload) =>
        apiFetch<NoteDto>(`/api/orders/${id}/add-note`, {
            method: "POST",
            body: JSON.stringify(payload)
        })
};

export const returnsApi = {
    list: (status: string) =>
        apiFetch<ReturnsListData>(`/api/returns/${status}`),
    get: (id: string) =>
        apiFetch<ReturnViewData>(`/api/returns/view/${id}`),
    create: (payload: ReturnCreatePayload) =>
        apiFetch<ReturnDto>("/api/returns/new", {
            method: "POST",
            body: JSON.stringify(payload)
        }),
    update: (id: string, payload: ReturnUpdatePayload) =>
        apiFetch<ReturnDto>(`/api/returns/view/${id}/update`, {
            method: "POST",
            body: JSON.stringify(payload)
        }),
    started: (id: string, payload: ReturnStartedPayload) =>
        apiFetch<ReturnDto>(`/api/returns/view/${id}/started`, {
            method: "POST",
            body: JSON.stringify(payload)
        }),
    posted: (id: string) =>
        apiFetch<ReturnDto>(`/api/returns/view/${id}/posted`, {
            method: "POST",
            body: JSON.stringify({})
        }),
    received: (id: string, payload: ReturnReceivedPayload) =>
        apiFetch<ReturnDto>(`/api/returns/view/${id}/received`, {
            method: "POST",
            body: JSON.stringify(payload)
        }),
    refund: (id: string, payload: ReturnRefundPayload) =>
        apiFetch<ReturnDto>(`/api/returns/view/${id}/refund`, {
            method: "POST",
            body: JSON.stringify(payload)
        }),
    close: (id: string) =>
        apiFetch<ReturnDto>(`/api/returns/view/${id}/close`, {
            method: "POST",
            body: JSON.stringify({})
        }),
    addNote: (id: string, payload: AddNotePayload) =>
        apiFetch<NoteDto>(`/api/returns/${id}/add-note`, {
            method: "POST",
            body: JSON.stringify(payload)
        })
};

export interface StorageListData {
    Storages: StorageDto[];
    Storage?: StorageDto;
}

export interface StorageViewData {
    Storage: StorageDto;
    Items: ItemDto[];
    Storages: StorageDto[];
}

export interface StorageCreatePayload {
    type: "building" | "unit" | "bin";
    name: string;
    skuPrefix: string;
    parentId?: string;
}

export interface StorageAssignItemPayload {
    itemId: string;
}

export const storageApi = {
    list: (type: string, id: string) =>
        apiFetch<StorageListData>(`/api/storage/list/${type}/${id}`),
    get: (id: string) =>
        apiFetch<StorageViewData>(`/api/storage/view/${id}`),
    create: (payload: StorageCreatePayload) =>
        apiFetch<StorageDto>("/api/storage/new", {
            method: "POST",
            body: JSON.stringify(payload)
        }),
    assignItem: (id: string, payload: StorageAssignItemPayload) =>
        apiFetch<{ Storage: StorageDto; Item: ItemDto }>(
            `/api/storage/view/${id}/assign-item`,
            {
                method: "POST",
                body: JSON.stringify(payload)
            }
        )
};

export interface PostagePolicyFormPayload {
    name: string;
    costToBuyer: number;
    actualCost: number;
}

export const postagePoliciesApi = {
    list: () => apiFetch<PostagePolicyDto[]>("/api/postage-policies/"),
    get: (id: string) =>
        apiFetch<PostagePolicyDto>(`/api/postage-policies/${id}`),
    create: (payload: PostagePolicyFormPayload) =>
        apiFetch<PostagePolicyDto>("/api/postage-policies/new", {
            method: "POST",
            body: JSON.stringify(payload)
        }),
    update: (id: string, payload: PostagePolicyFormPayload) =>
        apiFetch<PostagePolicyDto>(`/api/postage-policies/${id}/update`, {
            method: "POST",
            body: JSON.stringify(payload)
        }),
    archive: (id: string) =>
        apiFetch<PostagePolicyDto>(`/api/postage-policies/${id}/archive`, {
            method: "POST",
            body: JSON.stringify({})
        })
};