import { Request, Response } from "express";
import Me from "../../../src/routes/api/auth/me";
import Logout from "../../../src/routes/api/auth/logout";
import { User } from "../../../src/database/entities/User";

function createMockRes() {
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

function stubUser(): User {
    return {
        Id: "user-1",
        Email: "a@b.com",
        Username: "alice",
        Password: "hash",
        Verified: true,
        Admin: false,
        Active: true,
        WhenCreated: new Date("2024-01-01"),
        WhenUpdated: new Date("2024-01-01")
    } as User;
}

describe("API auth handlers", () => {
    describe("Me", () => {
        const me = new Me();

        it("returns 401 when not authenticated", () => {
            const req = { session: {} } as unknown as Request;
            const res = createMockRes();

            me.OnGet(req, res);

            expect(res.statusCode).toBe(401);
            expect(res.body).toEqual({ IsSuccess: false, Message: "Not authenticated" });
        });

        it("returns mapped user when authenticated", () => {
            const user = stubUser();
            const req = { session: { User: user } } as unknown as Request;
            const res = createMockRes();

            me.OnGet(req, res);

            expect(res.statusCode).toBe(200);
            expect(res.body.IsSuccess).toBe(true);
            expect(res.body.Data).toEqual({
                Id: "user-1",
                WhenCreated: user.WhenCreated,
                WhenUpdated: user.WhenUpdated,
                Email: "a@b.com",
                Username: "alice",
                Verified: true,
                Admin: false,
                Active: true
            });
            expect(res.body.Data.Password).toBeUndefined();
        });
    });

    describe("Logout", () => {
        const logout = new Logout();

        it("destroys the session and clears the cookie", () => {
            const destroy = jest.fn((cb: (err?: Error) => void) => cb());
            const req = { session: { destroy } } as unknown as Request;
            const res = createMockRes();

            logout.OnPost(req, res);

            expect(destroy).toHaveBeenCalled();
            expect(res.clearedCookie).toBe("connect.sid");
            expect(res.body).toEqual({ IsSuccess: true, Message: "Logged out" });
        });

        it("returns 500 when destroy fails", () => {
            const destroy = jest.fn((cb: (err?: Error) => void) => cb(new Error("boom")));
            const req = { session: { destroy } } as unknown as Request;
            const res = createMockRes();

            logout.OnPost(req, res);

            expect(res.statusCode).toBe(500);
            expect(res.body).toEqual({ IsSuccess: false, Message: "Failed to log out" });
        });
    });
});
