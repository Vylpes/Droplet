import { Request, Response, NextFunction } from "express";
import { ApiUserMiddleware } from "../../src/middleware/apiUserMiddleware";
import { User } from "../../src/database/entities/User";

function createMockRes() {
    const res = {
        statusCode: 200,
        body: undefined as unknown,
        status(code: number) {
            this.statusCode = code;
            return this;
        },
        json(payload: unknown) {
            this.body = payload;
            return this;
        }
    };
    return res as unknown as Response & { statusCode: number; body: any };
}

function stubUser(admin: boolean): User {
    return {
        Id: "user-1",
        Email: "a@b.com",
        Username: admin ? "admin" : "alice",
        Password: "hash",
        Verified: true,
        Admin: admin,
        Active: true
    } as User;
}

describe("ApiUserMiddleware", () => {
    describe("Authorise", () => {
        it("calls next when session has a User", () => {
            const req = { session: { User: stubUser(false) } } as unknown as Request;
            const res = createMockRes();
            const next = jest.fn() as NextFunction;

            ApiUserMiddleware.Authorise(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.statusCode).toBe(200);
        });

        it("returns 401 JSON when session has no User", () => {
            const req = { session: {} } as unknown as Request;
            const res = createMockRes();
            const next = jest.fn() as NextFunction;

            ApiUserMiddleware.Authorise(req, res, next);

            expect(next).not.toHaveBeenCalled();
            expect(res.statusCode).toBe(401);
            expect(res.body).toEqual({ IsSuccess: false, Message: "Access denied" });
        });
    });

    describe("AdminAuthorise", () => {
        it("calls next when User is Admin", () => {
            const req = { session: { User: stubUser(true) } } as unknown as Request;
            const res = createMockRes();
            const next = jest.fn() as NextFunction;

            ApiUserMiddleware.AdminAuthorise(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        it("returns 403 JSON when User is not Admin", () => {
            const req = { session: { User: stubUser(false) } } as unknown as Request;
            const res = createMockRes();
            const next = jest.fn() as NextFunction;

            ApiUserMiddleware.AdminAuthorise(req, res, next);

            expect(next).not.toHaveBeenCalled();
            expect(res.statusCode).toBe(403);
            expect(res.body).toEqual({ IsSuccess: false, Message: "Forbidden" });
        });

        it("returns 403 JSON when there is no User", () => {
            const req = { session: {} } as unknown as Request;
            const res = createMockRes();
            const next = jest.fn() as NextFunction;

            ApiUserMiddleware.AdminAuthorise(req, res, next);

            expect(next).not.toHaveBeenCalled();
            expect(res.statusCode).toBe(403);
        });
    });
});
