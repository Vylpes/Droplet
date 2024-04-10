import { User } from "../../../src/database/entities/User";
import AdminRegister from "../../../src/routes/auth/adminRegister";
import { Request, Response } from "express";
import createHttpError from "http-errors";

describe("OnGetAsync", () => {
    test("GIVEN no user already exists, EXPECT admin register view to be rendered", async () => {
        // Arrange
        const req = {
            session: {
                User: null,
            }
        } as unknown as Request;

        const res = {
            render: jest.fn(),
            locals: {
                viewData: {},
            },
        } as unknown as Response;

        const next = jest.fn();

        User.Any = jest.fn().mockResolvedValue(false);

        // Act
        const route = new AdminRegister();
        await route.OnGetAsync(req, res, next);

        // Assert
        expect(User.Any).toHaveBeenCalledTimes(1);
        expect(User.Any).toHaveBeenCalledWith(User);

        expect(res.render).toHaveBeenCalledTimes(1);
        expect(res.render).toHaveBeenCalledWith("auth/admin-register", {});
    });

    test("GIVEN user is logged in, EXPECT 403 error", async () => {
        // Arrange
        const req = {
            session: {
                User: {},
            }
        } as unknown as Request;

        const res = {
            render: jest.fn(),
            locals: {
                viewData: {},
            },
        } as unknown as Response;

        const next = jest.fn();

        User.Any = jest.fn().mockResolvedValue(false);

        // Act
        const route = new AdminRegister();
        await route.OnGetAsync(req, res, next);

        // Assert
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(createHttpError(403));

        expect(res.render).not.toBeCalled();
    });

    test.todo("GIVEN a user already exists, EXPECT 403 error");
});

describe("OnPostAsync", () => {
    test.todo("EXPECT user to be created");

    test.todo("GIVEN user is logged in, EXPECT 403 error");

    test.todo("GIVEN a user already exists, EXPECT 403 error");
});