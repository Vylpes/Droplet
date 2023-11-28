export enum ErrorCode {
    Unknown,
    NotEnoughQuantity,
}

export const ErrorMessages = new Map<ErrorCode, string>(
    [
        [ ErrorCode.Unknown, "Unknown error" ],
        [ ErrorCode.NotEnoughQuantity, "Not enough items" ],
    ]
);