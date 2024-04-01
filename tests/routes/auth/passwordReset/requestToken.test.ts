import { Request, Response } from "express";
import RequestToken from "../../../../src/routes/auth/passwordReset/requestToken";
import createHttpError from "http-errors";
import BodyValidator from "../../../../src/helpers/Validation/BodyValidator";
import { User } from "../../../../src/database/entities/User";
import PasswordHelper from "../../../../src/helpers/PasswordHelper";
import bcryptjs from "bcryptjs";
import UserToken from "../../../../src/database/entities/UserToken";
import { UserTokenType } from "../../../../src/constants/UserTokenType";
import EmailHelper from "../../../../src/helpers/EmailHelper";
import MessageHelper from "../../../../src/helpers/MessageHelper";

beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();

    process.env = {};
});

describe("OnGet", () => {
    test("GIVEN user is logged in, EXPECT 403 error", () => {
        const req = {
            session: {
                User: {},
            }
        } as unknown as Request;

        const res = {
            render: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        const route = new RequestToken();
        route.OnGet(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(createHttpError(403));

        expect(res.render).not.toHaveBeenCalled();
    });

    test("GIVEN user is not logged in, EXPECT view to be rendered", () => {
        const req = {
            session: {
                User: null,
            }
        } as unknown as Request;

        const res = {
            render: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        const route = new RequestToken();
        route.OnGet(req, res, next);

        expect(next).not.toHaveBeenCalled();

        expect(res.render).toHaveBeenCalledTimes(1);
        expect(res.render).toHaveBeenCalledWith("auth/password-reset/request-token");
    });
});

describe("OnPostAsync", () => {
    test("EXPECT reset token to be generated", async () => {
        // Arrange
        let userTokenSaved: UserToken | undefined;

        process.env.EMAIL_TEMPLATE_PASSWORDRESET_RESETLINK = "reset_link";

        const req = {
            body: {
                email: "email",
            }
        } as unknown as Request;

        const res = {
            redirect: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        BodyValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        BodyValidator.prototype.EmailAddress = jest.fn().mockReturnThis();
        BodyValidator.prototype.Validate = jest.fn().mockResolvedValue(true);

        const user = {
            AddTokenToUser: jest.fn(),
            Save: jest.fn(),
            Username: "username",
            Email: "email",
        };

        User.FetchOneByEmail = jest.fn().mockResolvedValue(user);

        PasswordHelper.GenerateRandomToken = jest.fn().mockResolvedValue("token");

        jest.spyOn(bcryptjs, "hash").mockResolvedValue("hashed" as never);

        UserToken.prototype.Save = jest.fn().mockImplementation((_, entity: UserToken) => {
            userTokenSaved = entity;
        });

        jest
            .useFakeTimers()
            .setSystemTime(new Date("2024-04-01"));

        EmailHelper.SendEmail = jest.fn();

        MessageHelper.prototype.Info = jest.fn();

        // Act
        const route = new RequestToken();
        await route.OnPostAsync(req, res, next);

        // Assert
        expect(BodyValidator.prototype.NotEmpty).toHaveBeenCalledTimes(1);
        expect(BodyValidator.prototype.EmailAddress).toHaveBeenCalledTimes(1);

        expect(BodyValidator.prototype.Validate).toHaveBeenCalledTimes(1);
        expect(BodyValidator.prototype.Validate).toHaveBeenCalledWith(req);

        expect(User.FetchOneByEmail).toHaveBeenCalledTimes(1);
        expect(User.FetchOneByEmail).toHaveBeenCalledWith("email", [
            "Tokens",
        ]);

        expect(PasswordHelper.GenerateRandomToken).toHaveBeenCalledTimes(1);

        expect(UserToken.prototype.Save).toHaveBeenCalledTimes(1);
        expect(userTokenSaved).toBeDefined();
        expect(userTokenSaved!.Token).toBe("hashed");
        expect(userTokenSaved!.Expires).toStrictEqual(new Date("2024-04-03"));
        expect(userTokenSaved!.Type).toBe(UserTokenType.PasswordReset);

        expect(user.AddTokenToUser).toHaveBeenCalledTimes(1);
        expect(user.AddTokenToUser).toHaveBeenCalledWith(userTokenSaved);

        expect(user.Save).toHaveBeenCalledTimes(1);
        expect(user.Save).toHaveBeenCalledWith(User, user);

        expect(EmailHelper.SendEmail).toHaveBeenCalledTimes(1);
        expect(EmailHelper.SendEmail).toHaveBeenCalledWith("email", "PasswordReset", [{
            key: "username",
            value: "username",
        }, {
            key: "reset_link",
            value: "reset_link",
        }]);

        expect(MessageHelper.prototype.Info).toHaveBeenCalledTimes(1);
        expect(MessageHelper.prototype.Info).toHaveBeenCalledWith("If this email is correct you should receive an email to reset your password.");

        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(res.redirect).toHaveBeenCalledWith("/auth/login");
    });

    test.todo("GIVEN user cannot be found, EXPECT masked error");

    test.todo("GIVEN resetLink is undefined, EXPECT invalid config error");
});