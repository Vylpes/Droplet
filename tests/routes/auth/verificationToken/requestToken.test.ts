import RequestToken from "../../../../src/routes/auth/verificationToken/requestToken";
import { Request, Response } from "express";
import createHttpError from "http-errors";
import BodyValidator from "../../../../src/helpers/Validation/BodyValidator";
import { User } from "../../../../src/database/entities/User";
import UserToken from "../../../../src/database/entities/UserToken";
import PasswordHelper from "../../../../src/helpers/PasswordHelper";
import bcryptjs from "bcryptjs";
import EmailHelper from "../../../../src/helpers/EmailHelper";
import MessageHelper from "../../../../src/helpers/MessageHelper";

beforeEach(() => {
    process.env = {};
});

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
        let userTokenSaved: UserToken | undefined;

        // Arrange
        process.env.EMAIL_TEMPLATE_VERIFYUSER_VERIFYLINK = "verify_link {token}";

        const req = {
            body: {
                email: "test@mail.com",
            }
        } as unknown as Request;

        const res = {
            redirect: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        const user = {
            Id: "userId",
            Email: "test@mail.com",
            Username: "username",
            Verified: false,
            Active: true,
            AddTokenToUser: jest.fn(),
            Save: jest.fn(),
        };

        BodyValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        BodyValidator.prototype.EmailAddress = jest.fn().mockReturnThis();
        BodyValidator.prototype.Validate = jest.fn().mockResolvedValueOnce(true);

        User.FetchOneByEmail = jest.fn().mockResolvedValue(user);

        UserToken.InvalidateAllTokensForUser = jest.fn();

        UserToken.prototype.Save = jest.fn().mockImplementation((_, userToken: UserToken) => {
            userTokenSaved = userToken;
        });

        PasswordHelper.GenerateRandomToken = jest.fn().mockResolvedValue("token");

        EmailHelper.SendEmail = jest.fn();

        MessageHelper.prototype.Info = jest.fn();

        jest
            .useFakeTimers()
            .setSystemTime(new Date("2024-04-01"));

        const hashSpy = jest.spyOn(bcryptjs, "hash").mockResolvedValue("hashedToken" as never);

        // Act
        const route = new RequestToken();
        await route.OnPostAsync(req, res, next);

        // Assert
        expect(BodyValidator.prototype.NotEmpty).toHaveBeenCalledTimes(1);
        expect(BodyValidator.prototype.EmailAddress).toHaveBeenCalledTimes(1);

        expect(BodyValidator.prototype.Validate).toHaveBeenCalledTimes(1);
        expect(BodyValidator.prototype.Validate).toHaveBeenCalledWith(req);

        expect(User.FetchOneByEmail).toHaveBeenCalledTimes(1);
        expect(User.FetchOneByEmail).toBeCalledWith("test@mail.com", [ "Tokens" ]);

        expect(UserToken.InvalidateAllTokensForUser).toHaveBeenCalledTimes(1);
        expect(UserToken.InvalidateAllTokensForUser).toHaveBeenCalledWith("userId");

        expect(UserToken.prototype.Save).toHaveBeenCalledTimes(1);
        expect(UserToken.prototype.Save).toHaveBeenCalledWith(UserToken, userTokenSaved);

        expect(PasswordHelper.GenerateRandomToken).toHaveBeenCalledTimes(1);

        expect(EmailHelper.SendEmail).toHaveBeenCalledTimes(1);
        expect(EmailHelper.SendEmail).toHaveBeenCalledWith("test@mail.com", "VerifyUser", [
            {
                key: "username",
                value: "username",
            },
            {
                key: "verify_link",
                value: "verify_link token",
            }
        ]);

        expect(MessageHelper.prototype.Info).toHaveBeenCalledTimes(1);
        expect(MessageHelper.prototype.Info).toHaveBeenCalledWith("If this email is correct you should receive an email to reset your password.");

        expect(user.AddTokenToUser).toHaveBeenCalledTimes(1);
        expect(user.AddTokenToUser).toHaveBeenCalledWith(userTokenSaved);

        expect(user.Save).toHaveBeenCalledTimes(1);
        expect(user.Save).toHaveBeenCalledWith(User, user);

        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(res.redirect).toHaveBeenCalledWith("/auth/login");

        expect(hashSpy).toHaveBeenCalledTimes(1);
        expect(hashSpy).toHaveBeenCalledWith("token", 10);

        expect(userTokenSaved).toBeDefined();
        expect(userTokenSaved?.Token).toBe("hashedToken");
        expect(userTokenSaved?.Expires).toStrictEqual(new Date("2024-04-03"));
    });

    test("GIVEN validator is invalid, EXPECT redirection", async () => {
        let userTokenSaved: UserToken | undefined;

        // Arrange
        process.env.EMAIL_TEMPLATE_VERIFYUSER_VERIFYLINK = "verify_link {token}";

        const req = {
            body: {
                email: "test@mail.com",
            }
        } as unknown as Request;

        const res = {
            redirect: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        const user = {
            Id: "userId",
            Email: "test@mail.com",
            Username: "username",
            Verified: false,
            Active: true,
            AddTokenToUser: jest.fn(),
            Save: jest.fn(),
        };

        BodyValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        BodyValidator.prototype.EmailAddress = jest.fn().mockReturnThis();
        BodyValidator.prototype.Validate = jest.fn().mockResolvedValueOnce(false);

        User.FetchOneByEmail = jest.fn().mockResolvedValue(user);

        UserToken.InvalidateAllTokensForUser = jest.fn();

        UserToken.prototype.Save = jest.fn().mockImplementation((_, userToken: UserToken) => {
            userTokenSaved = userToken;
        });

        PasswordHelper.GenerateRandomToken = jest.fn().mockResolvedValue("token");

        EmailHelper.SendEmail = jest.fn();

        MessageHelper.prototype.Info = jest.fn();

        jest
            .useFakeTimers()
            .setSystemTime(new Date("2024-04-01"));

        const hashSpy = jest.spyOn(bcryptjs, "hash").mockResolvedValue("hashedToken" as never);

        // Act
        const route = new RequestToken();
        await route.OnPostAsync(req, res, next);

        // Assert
        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(res.redirect).toHaveBeenCalledWith("/auth/verification-token/request");
    });

    test("GIVEN user is not found, EXPECT masked error", async () => {
        let userTokenSaved: UserToken | undefined;

        // Arrange
        process.env.EMAIL_TEMPLATE_VERIFYUSER_VERIFYLINK = "verify_link {token}";

        const req = {
            body: {
                email: "test@mail.com",
            }
        } as unknown as Request;

        const res = {
            redirect: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        BodyValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        BodyValidator.prototype.EmailAddress = jest.fn().mockReturnThis();
        BodyValidator.prototype.Validate = jest.fn().mockResolvedValueOnce(true);

        User.FetchOneByEmail = jest.fn().mockResolvedValue(null);

        UserToken.InvalidateAllTokensForUser = jest.fn();

        UserToken.prototype.Save = jest.fn().mockImplementation((_, userToken: UserToken) => {
            userTokenSaved = userToken;
        });

        PasswordHelper.GenerateRandomToken = jest.fn().mockResolvedValue("token");

        EmailHelper.SendEmail = jest.fn();

        MessageHelper.prototype.Info = jest.fn();

        jest
            .useFakeTimers()
            .setSystemTime(new Date("2024-04-01"));

        const hashSpy = jest.spyOn(bcryptjs, "hash").mockResolvedValue("hashedToken" as never);

        // Act
        const route = new RequestToken();
        await route.OnPostAsync(req, res, next);

        // Assert
        expect(MessageHelper.prototype.Info).toHaveBeenCalledTimes(1);
        expect(MessageHelper.prototype.Info).toHaveBeenCalledWith("If this email is correct you should receive an email to reset your password.");

        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(res.redirect).toHaveBeenCalledWith("/auth/login");
    });

    test("GIVEN user is already verified, EXPECT error", async () => {
        let userTokenSaved: UserToken | undefined;

        // Arrange
        process.env.EMAIL_TEMPLATE_VERIFYUSER_VERIFYLINK = "verify_link {token}";

        const reqSession = {};

        const req = {
            body: {
                email: "test@mail.com",
            },
            session: reqSession,
        } as unknown as Request;

        const res = {
            redirect: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        const user = {
            Id: "userId",
            Email: "test@mail.com",
            Username: "username",
            Verified: true,
            Active: true,
            AddTokenToUser: jest.fn(),
            Save: jest.fn(),
        };

        BodyValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        BodyValidator.prototype.EmailAddress = jest.fn().mockReturnThis();
        BodyValidator.prototype.Validate = jest.fn().mockResolvedValueOnce(true);

        User.FetchOneByEmail = jest.fn().mockResolvedValue(user);

        UserToken.InvalidateAllTokensForUser = jest.fn();

        UserToken.prototype.Save = jest.fn().mockImplementation((_, userToken: UserToken) => {
            userTokenSaved = userToken;
        });

        PasswordHelper.GenerateRandomToken = jest.fn().mockResolvedValue("token");

        EmailHelper.SendEmail = jest.fn();

        MessageHelper.prototype.Error = jest.fn();

        jest
            .useFakeTimers()
            .setSystemTime(new Date("2024-04-01"));

        const hashSpy = jest.spyOn(bcryptjs, "hash").mockResolvedValue("hashedToken" as never);

        // Act
        const route = new RequestToken();
        await route.OnPostAsync(req, res, next);

        // Assert
        expect(MessageHelper.prototype.Error).toHaveBeenCalledTimes(1);
        expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("User is either inactive or already verified");

        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(res.redirect).toHaveBeenCalledWith("/auth/login");
    });

    test("GIVEN user is not active, EXPECT error", async () => {
        let userTokenSaved: UserToken | undefined;

        // Arrange
        process.env.EMAIL_TEMPLATE_VERIFYUSER_VERIFYLINK = "verify_link {token}";

        const req = {
            body: {
                email: "test@mail.com",
            }
        } as unknown as Request;

        const res = {
            redirect: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        const user = {
            Id: "userId",
            Email: "test@mail.com",
            Username: "username",
            Verified: false,
            Active: false,
            AddTokenToUser: jest.fn(),
            Save: jest.fn(),
        };

        BodyValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        BodyValidator.prototype.EmailAddress = jest.fn().mockReturnThis();
        BodyValidator.prototype.Validate = jest.fn().mockResolvedValueOnce(true);

        User.FetchOneByEmail = jest.fn().mockResolvedValue(user);

        UserToken.InvalidateAllTokensForUser = jest.fn();

        UserToken.prototype.Save = jest.fn().mockImplementation((_, userToken: UserToken) => {
            userTokenSaved = userToken;
        });

        PasswordHelper.GenerateRandomToken = jest.fn().mockResolvedValue("token");

        EmailHelper.SendEmail = jest.fn();

        MessageHelper.prototype.Error = jest.fn();

        jest
            .useFakeTimers()
            .setSystemTime(new Date("2024-04-01"));

        const hashSpy = jest.spyOn(bcryptjs, "hash").mockResolvedValue("hashedToken" as never);

        // Act
        const route = new RequestToken();
        await route.OnPostAsync(req, res, next);

        // Assert
        expect(MessageHelper.prototype.Error).toHaveBeenCalledTimes(1);
        expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("User is either inactive or already verified");

        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(res.redirect).toHaveBeenCalledWith("/auth/login");
    });

    test("GIVEN verify link is not in .env, EXPECT error", async () => {
        let userTokenSaved: UserToken | undefined;

        // Arrange
        process.env.EMAIL_TEMPLATE_VERIFYUSER_VERIFYLINK = undefined;

        const req = {
            body: {
                email: "test@mail.com",
            }
        } as unknown as Request;

        const res = {
            redirect: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        const user = {
            Id: "userId",
            Email: "test@mail.com",
            Username: "username",
            Verified: false,
            Active: true,
            AddTokenToUser: jest.fn(),
            Save: jest.fn(),
        };

        BodyValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        BodyValidator.prototype.EmailAddress = jest.fn().mockReturnThis();
        BodyValidator.prototype.Validate = jest.fn().mockResolvedValueOnce(true);

        User.FetchOneByEmail = jest.fn().mockResolvedValue(user);

        UserToken.InvalidateAllTokensForUser = jest.fn();

        UserToken.prototype.Save = jest.fn().mockImplementation((_, userToken: UserToken) => {
            userTokenSaved = userToken;
        });

        PasswordHelper.GenerateRandomToken = jest.fn().mockResolvedValue("token");

        EmailHelper.SendEmail = jest.fn();

        MessageHelper.prototype.Error = jest.fn();

        jest
            .useFakeTimers()
            .setSystemTime(new Date("2024-04-01"));

        const hashSpy = jest.spyOn(bcryptjs, "hash").mockResolvedValue("hashedToken" as never);

        // Act
        const route = new RequestToken();
        await route.OnPostAsync(req, res, next);

        // Assert
        expect(MessageHelper.prototype.Error).toHaveBeenCalledTimes(1);
        expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("Invalid config: EMAIL_TEMPLATE_VERIFYUSER_VERIFYLINK");

        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(res.redirect).toHaveBeenCalledWith("/auth/login");
    });
});