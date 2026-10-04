export interface IBasicResponse<T = unknown> {
    IsSuccess: boolean;
    Message?: string;
    Data?: T;
}
