import { Request, Response } from "express";
import Index from "../../../src/routes/dashboard/indexPage";

describe("OnGet", () => {
    test("EXPECT page to be rendered", () => {
        // Arrange
        const req = {} as unknown as Request;

        const res = {
            render: jest.fn(),
            locals: {
                viewData: {},
            },
        } as unknown as Response;

        // Act
        const page = new Index();
        page.OnGet(req, res);

        // Assert
        expect(res.render).toHaveBeenCalledTimes(1);
        expect(res.render).toHaveBeenCalledWith("dashboard/index", {});
    });
});