import { UserMiddleware } from '../../src/middleware/userMiddleware';
import { Request, Response, NextFunction } from 'express';

describe("Authorise", () => {
    test("GIVEN user is logged in, EXPECT next to be called", () => {
        const req: Request = {
            session: {
                User: {},
                error: "",
            },
        } as unknown as Request;
        const res: Response = {} as Response;
        const next: NextFunction = jest.fn();

        UserMiddleware.Authorise(req, res, next);

        expect(next).toBeCalled();
    });

    test("GIVEN user is not logged in, EXPECT redirect to login", () => {
        const req: Request = {
            session: {
                User: undefined,
            },
            flash: jest.fn(),
        } as unknown as Request;
        const res: Response = { redirect: jest.fn() } as unknown as Response;
        const next: NextFunction = jest.fn();

        UserMiddleware.Authorise(req, res, next);

        expect(req.flash).toBeCalledWith("error", "Access denied");
        expect(res.redirect).toBeCalledWith('/auth/login');
    });
});

describe("AdminAuthorise", () => {
    test("GIVEN user is logged in and is an admin, EXPECT next to be called", () => {
        const req: Request = { session: { User: { Admin: true } } } as unknown as Request;
        const res: Response = {} as Response;
        const next: NextFunction = jest.fn();

        UserMiddleware.AdminAuthorise(req, res, next);

        expect(next).toBeCalled();
    });

    test("GIVEN user is not logged in, EXPECT 403 error", () => {
        const req: Request = { session: {} } as Request;
        const res: Response = {} as Response;
        const next: NextFunction = jest.fn();

        UserMiddleware.AdminAuthorise(req, res, next);

        expect(next).toBeCalledWith(expect.any(Error));
        expect(next).toBeCalledWith(expect.objectContaining({ status: 403 }));
    });

    test("GIVEN user is logged in but not an admin, EXPECT 403 error", () => {
        const req: Request = { session: { User: { Admin: false } } } as unknown as Request;
        const res: Response = {} as Response;
        const next: NextFunction = jest.fn();

        UserMiddleware.AdminAuthorise(req, res, next);

        expect(next).toBeCalledWith(expect.any(Error));
        expect(next).toBeCalledWith(expect.objectContaining({ status: 403 }));
    });
});