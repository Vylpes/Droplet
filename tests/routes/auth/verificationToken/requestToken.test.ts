import RequestToken from "../../../../src/routes/auth/verificationToken/requestToken";
import { Request, Response } from "express";
import createHttpError from "http-errors";
import BodyValidator from "../../../../src/helpers/Validation/BodyValidator";

describe("OnGet", () => {
    test("GIVEN user is not logged in, EXPECT page to be rendered", () => {
        // Arrange
        const req = {
            session: {
                User: null,
            }
        } as unknown as Request;

        const res = {
            render: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        // Act
        const route = new RequestToken();
        route.OnGet(req, res, next);

        // Assert
        expect(res.render).toHaveBeenCalledTimes(1);
        expect(res.render).toHaveBeenCalledWith("auth/verification-token/request-token");
    });

    test("GIVEN user is logged in, EXPECT 403 error", () => {
        // Arrange
        const req = {
            session: {
                User: {},
            }
        } as unknown as Request;

        const res = {
            render: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        // Act
        const route = new RequestToken();
        route.OnGet(req, res, next);

        // Assert
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(createHttpError(403));

        expect(res.render).not.toHaveBeenCalled();
    });
});

describe("OnPostAsync", () => {
    test("EXPECT token to be generated", async () => {
        // Arrange
        const req = {} as unknown as Request;

        const res = {} as unknown as Response;

        const next = jest.fn();

        BodyValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        BodyValidator.prototype.EmailAddress = jest.fn().mockReturnThis();
        BodyValidator.prototype.Validate = jest.fn().mockResolvedValueOnce(true);

        // Act
        const route = new RequestToken();
        await route.OnPostAsync(req, res, next);

        // Assert
        expect(BodyValidator.prototype.NotEmpty).toHaveBeenCalledTimes(1);
        expect(BodyValidator.prototype.EmailAddress).toHaveBeenCalledTimes(1);

        expect(BodyValidator.prototype.Validate).toHaveBeenCalledTimes(1);
        expect(BodyValidator.prototype.Validate).toHaveBeenCalledWith(req);

        // TODO: Finish test
    });

    test.todo("GIVEN validator is invalid, EXPECT redirection");

    test.todo("GIVEN user is not found, EXPECT masked error");

    test.todo("GIVEN user is already verified, EXPECT error");

    test.todo("GIVEN user is not active, EXPECT error");

    test.todo("GIVEN verify link is not in .env, EXPECT error");
});