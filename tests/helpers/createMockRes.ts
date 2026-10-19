import { Response } from "express";

export function createMockRes() {
    const res = {
        statusCode: 200,
        body: undefined as unknown,
        clearedCookie: undefined as string | undefined,
        status(code: number) {
            this.statusCode = code;
            return this;
        },
        json(payload: unknown) {
            this.body = payload;
            return this;
        },
        clearCookie(name: string) {
            this.clearedCookie = name;
            return this;
        }
    };
    return res as unknown as Response & {
        statusCode: number;
        body: any;
        clearedCookie?: string;
    };
}
