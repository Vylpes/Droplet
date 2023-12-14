export enum ErrorCode {
    Unknown,
    NotEnoughQuantity,
    StateInvalid,
    DatabaseError,
}

export const ErrorMessages = new Map<ErrorCode, string>(
    [
        [ ErrorCode.Unknown, "Unknown error" ],
        [ ErrorCode.NotEnoughQuantity, "Not enough items" ],
        [ ErrorCode.StateInvalid, "State invalid" ],
        [ ErrorCode.DatabaseError, "Database error" ],
    ]
);