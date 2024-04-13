import Logout from "../../../src/routes/auth/logout";
import { Request, Response } from "express";

describe("OnGet", () => {
    test("EXPECT logout to be successful", () => {
        // Arrange
        const req = {
            session: {
                destroy: jest.fn().mockImplementation((callback: Function) => {
                    callback();
                }),
            }
        } as unknown as Request;

        const res = {
            redirect: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        // Act
        const route = new Logout();
        route.OnGet(req, res, next);

        // Assert
        expect(req.session.destroy).toHaveBeenCalledTimes(1);

        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(res.redirect).toHaveBeenCalledWith("/");
    });
});