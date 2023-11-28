import { ErrorCode, ErrorMessages } from "../constants/ErrorMessages";

export class Result<T> {
    public readonly IsSuccess: boolean;
    public readonly Value?: T;
    public readonly Error?: {
        Message: string,
        Code: ErrorCode,
    };

    constructor(result: T, errorMessage?: string, errorCode: ErrorCode = ErrorCode.Unknown) {
        if (errorMessage) {
            this.IsSuccess = false;
            this.Error = {
                Message: errorMessage,
                Code:  errorCode,
            };
        }

        this.IsSuccess = true;
        this.Value = result;
    }

    public static Ok<T>(result: T): Result<T> {
        return new Result<T>(result);
    }

    public static Fail(message: string): Result<null> {
        return new Result(null, message);
    }

    public static FailWithCode(code: ErrorCode): Result<null> {
        return new Result(null, ErrorMessages.get(code), code);
    }
}