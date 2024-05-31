import { Request, Response } from "express";
import IndexPage from "../../../src/routes/index/indexPage";

describe("OnGet", () => {
    test("GIVEN user is not logged in, EXPECT page to be rendered", () => {
        // Arrange
        const req = {} as unknown as Request;

        const res = {
            render: jest.fn(),
            redirect: jest.fn(),
            locals: {
                viewData: {
                    isAuthenticated: false,
                },
            },
        } as unknown as Response;

        // Act
        const page = new IndexPage();
        page.OnGet(req, res);

        // Assert
        expect(res.redirect).not.toHaveBeenCalled();

        expect(res.render).toHaveBeenCalledTimes(1);
        expect(res.render).toHaveBeenCalledWith("index/index", { isAuthenticated: false });
    });

    test("GIVEN user is logged in, EXPECT redirect to dashboard", () => {
        // Arrange
        const req = {} as unknown as Request;

        const res = {
            render: jest.fn(),
            redirect: jest.fn(),
            locals: {
                viewData: {
                    isAuthenticated: true,
                },
            },
        } as unknown as Response;

        // Act
        const page = new IndexPage();
        page.OnGet(req, res);

        // Assert
        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(res.redirect).toHaveBeenCalledWith("/dashboard");

        expect(res.render).not.toHaveBeenCalled();
    });
});