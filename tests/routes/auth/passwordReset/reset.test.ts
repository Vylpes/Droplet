import UserToken from "../../../../src/database/entities/UserToken";
import QueryValidator from "../../../../src/helpers/Validation/QueryValidator";
import Reset from "../../../../src/routes/auth/passwordReset/reset";
import { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import { UserTokenType } from "../../../../src/constants/UserTokenType";
import httpErrors from "http-errors";

describe("OnGetAsync", () => {
    test("GIVEN user is not logged in, EXPECT view to be rendered", async () => {
        // Arrange
        const req = {
            session: {
                User: null,
            },
            query: {
                token: "token",
            }
        } as unknown as Request;

        const res = {
            render: jest.fn(),
            locals: {},
        } as unknown as Response;

        const next = jest.fn();

        QueryValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        QueryValidator.prototype.Validate = jest.fn().mockResolvedValue(true);

        UserToken.FetchAll = jest.fn().mockResolvedValue([
            {
                Token: "token",
                Type: UserTokenType.PasswordReset,
                User: {},
                CheckIfExpired: jest.fn().mockResolvedValue(false),
            }
        ]);

        const comapreSyncMock = jest.spyOn(bcryptjs, "compareSync").mockReturnValue(true);

        // Act
        const reset = new Reset();
        await reset.OnGetAsync(req, res, next);

        // Assert
        expect(QueryValidator.prototype.NotEmpty).toHaveBeenCalledTimes(1);

        expect(QueryValidator.prototype.Validate).toHaveBeenCalledTimes(1);
        expect(QueryValidator.prototype.Validate).toHaveBeenCalledWith(req);

        expect(UserToken.FetchAll).toHaveBeenCalledTimes(1);
        expect(UserToken.FetchAll).toHaveBeenCalledWith(UserToken, ["User"]);

        expect(comapreSyncMock).toHaveBeenCalledTimes(1);

        expect(res.render).toHaveBeenCalledTimes(1);
        expect(res.render).toHaveBeenCalledWith("auth/password-reset/reset");
    });

    test("GIVEN user is logged in, EXPECT 403 error", async () => {
        // Arrange
        const req = {
            session: {
                User: {},
            },
            query: {
                token: "token",
            }
        } as unknown as Request;

        const res = {
            render: jest.fn(),
            locals: {},
        } as unknown as Response;

        const next = jest.fn();

        QueryValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        QueryValidator.prototype.Validate = jest.fn().mockResolvedValue(true);

        UserToken.FetchAll = jest.fn().mockResolvedValue([
            {
                Token: "token",
                Type: UserTokenType.PasswordReset,
                User: {},
                CheckIfExpired: jest.fn().mockResolvedValue(false),
            }
        ]);

        const comapreSyncMock = jest.spyOn(bcryptjs, "compareSync").mockReturnValue(true);

        // Act
        const reset = new Reset();
        await reset.OnGetAsync(req, res, next);

        // Assert
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(expect.any(httpErrors.Forbidden));

        expect(res.render).not.toHaveBeenCalled();
    });

    test("GIVEN token is invalid, EXPECT 401 error", async () => {
        // Arrange
        const req = {
            session: {
                User: null,
            },
            query: {
                token: "token",
            }
        } as unknown as Request;

        const res = {
            render: jest.fn(),
            locals: {},
        } as unknown as Response;

        const next = jest.fn();

        QueryValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        QueryValidator.prototype.Validate = jest.fn().mockResolvedValue(true);

        UserToken.FetchAll = jest.fn().mockResolvedValue([
            {
                Token: "token",
                Type: UserTokenType.PasswordReset,
                User: {},
                CheckIfExpired: jest.fn().mockResolvedValue(false),
            }
        ]);

        const comapreSyncMock = jest.spyOn(bcryptjs, "compareSync").mockReturnValue(false);

        // Act
        const reset = new Reset();
        await reset.OnGetAsync(req, res, next);

        // Assert
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(expect.any(httpErrors.Unauthorized));

        expect(res.render).not.toHaveBeenCalled();
    });

    test("GIVEN token is expired, EXPECT 401 error", async () => {
        // Arrange
        const req = {
            session: {
                User: null,
            },
            query: {
                token: "token",
            }
        } as unknown as Request;

        const res = {
            render: jest.fn(),
            locals: {},
        } as unknown as Response;

        const next = jest.fn();

        QueryValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        QueryValidator.prototype.Validate = jest.fn().mockResolvedValue(true);

        UserToken.FetchAll = jest.fn().mockResolvedValue([
            {
                Token: "token",
                Type: UserTokenType.PasswordReset,
                User: {},
                CheckIfExpired: jest.fn().mockResolvedValue(true),
            }
        ]);

        const comapreSyncMock = jest.spyOn(bcryptjs, "compareSync").mockReturnValue(true);

        // Act
        const reset = new Reset();
        await reset.OnGetAsync(req, res, next);

        // Assert
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(expect.any(httpErrors.Unauthorized));

        expect(res.render).not.toHaveBeenCalled();
    });

    test("GIVEN token is not a password reset token, EXPECT 401 error", async () => {
        // Arrange
        const req = {
            session: {
                User: null,
            },
            query: {
                token: "token",
            }
        } as unknown as Request;

        const res = {
            render: jest.fn(),
            locals: {},
        } as unknown as Response;

        const next = jest.fn();

        QueryValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        QueryValidator.prototype.Validate = jest.fn().mockResolvedValue(true);

        UserToken.FetchAll = jest.fn().mockResolvedValue([
            {
                Token: "token",
                Type: UserTokenType.Verification,
                User: {},
                CheckIfExpired: jest.fn().mockResolvedValue(false),
            }
        ]);

        const comapreSyncMock = jest.spyOn(bcryptjs, "compareSync").mockReturnValue(true);

        // Act
        const reset = new Reset();
        await reset.OnGetAsync(req, res, next);

        // Assert
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(expect.any(httpErrors.Unauthorized));

        expect(res.render).not.toHaveBeenCalled();
    });
});

describe("OnPostAsync", () => {
    test.todo("EXPECT router to be defined");

    test.todo("GIVEN session contains an error, EXPECT redirect to reset page");

    test.todo("GIVEN password is null, EXPECT validation error");

    test.todo("GIVEN password is too short, EXPECT validation error");

    test.todo("GIVEN password does not match passwordRepeat, EXPECT validation error");

    test.todo("GIVEN token is invalid, EXPECT 401 error");

    test.todo("GIVEN token is expired, EXPECT 401 error");

    test.todo("GIVEN token is not a password reset token, EXPECT 401 error");
});