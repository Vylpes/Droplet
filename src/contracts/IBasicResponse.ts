import type { IBasicResponse } from "@droplet/shared";

export type { IBasicResponse } from "@droplet/shared";

export function GenerateResponse<T = unknown>(
    isSuccess: boolean = true,
    message?: string,
    data?: T
): IBasicResponse<T> {
    const response: IBasicResponse<T> = {
        IsSuccess: isSuccess
    };

    if (message !== undefined) {
        response.Message = message;
    }

    if (data !== undefined) {
        response.Data = data;
    }

    return response;
}
