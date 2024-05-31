import { Request, Response } from "express";
import Calculator from "../../../src/routes/dashboard/calculator";

describe("OnGet", () => {
    test("EXPECT page to be rendered", () => {
        // Arrange
        const req = {} as unknown as Request;
        const res = {
            render: jest.fn(),
            locals: {
                viewData: {}
            },
        } as unknown as Response;

        // Act
        const page = new Calculator();
        page.OnGet(req, res);

        // Assert
        expect(res.render).toHaveBeenCalledTimes(1);
        expect(res.render).toHaveBeenCalledWith('dashboard/calculator', res.locals.viewData);
    });
});