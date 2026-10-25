export interface IBasicResponse<T = unknown> {
    IsSuccess: boolean;
    Message?: string;
    Data?: T;
    /** Field-keyed validation errors for React form UX (#351). */
    Errors?: Record<string, string>;
}
