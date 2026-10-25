import type { IBasicResponse } from "@droplet/shared";
import type { ApiValidationFailure } from "../helpers/Validation/ApiBodyValidator";

export type { IBasicResponse } from "@droplet/shared";

export function GenerateResponse<T = unknown>(
    isSuccess: boolean = true,
    message?: string,
    data?: T,
    errors?: Record<string, string>
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

    if (errors !== undefined) {
        response.Errors = errors;
    }

    return response;
}

/** Map an ApiBodyValidator failure to a JSON body with field Errors (#351). */
export function GenerateValidationResponse(
    failure: ApiValidationFailure
): IBasicResponse {
    return GenerateResponse(false, failure.message, undefined, {
        [failure.field]: failure.message
    });
}
