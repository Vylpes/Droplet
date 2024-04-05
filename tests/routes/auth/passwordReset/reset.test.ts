import UserToken from "../../../../src/database/entities/UserToken";
import QueryValidator from "../../../../src/helpers/Validation/QueryValidator";
import Reset from "../../../../src/routes/auth/passwordReset/reset";
import { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import { UserTokenType } from "../../../../src/constants/UserTokenType";
import httpErrors from "http-errors";
import BodyValidator from "../../../../src/helpers/Validation/BodyValidator";
import MessageHelper from "../../../../src/helpers/MessageHelper";
import { User } from "../../../../src/database/entities/User";
import createHttpError from "http-errors";

beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
})

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
    test("EXPECT password to be reset", async () => {
        // Arrange
        const req = {
            query: {
                token: "token",
            },
            body: {
                password: "12345678",
                passwordRepeat: "12345678",
            }
        } as unknown as Request;

        const res = {
            redirect: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        const userToken = {
            Token: "token",
            Type: UserTokenType.PasswordReset,
            CheckIfExpired: jest.fn().mockResolvedValue(false),
            User: {
                UpdatePassword: jest.fn(),
                Save: jest.fn(),
            }
        }

        QueryValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        QueryValidator.prototype.Validate = jest.fn().mockResolvedValue(true);

        BodyValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        BodyValidator.prototype.MinLength = jest.fn().mockReturnThis();
        BodyValidator.prototype.EqualToField = jest.fn().mockReturnThis();
        BodyValidator.prototype.Validate = jest.fn().mockResolvedValue(true);

        UserToken.FetchAll = jest.fn().mockResolvedValue([userToken]);
        UserToken.Remove = jest.fn();

        MessageHelper.prototype.Info = jest.fn();

        const compareSync = jest.spyOn(bcryptjs, "compareSync").mockReturnValue(true);
        const hash = jest.spyOn(bcryptjs, "hash").mockResolvedValue("hashedPassword" as never);

        // Act
        const reset = new Reset();
        await reset.OnPostAsync(req, res, next);

        // Assert
        expect(QueryValidator.prototype.NotEmpty).toHaveBeenCalledTimes(1);

        expect(QueryValidator.prototype.Validate).toHaveBeenCalledTimes(1);
        expect(QueryValidator.prototype.Validate).toHaveBeenCalledWith(req);

        expect(BodyValidator.prototype.NotEmpty).toHaveBeenCalledTimes(1);

        expect(BodyValidator.prototype.MinLength).toHaveBeenCalledTimes(1);
        expect(BodyValidator.prototype.MinLength).toHaveBeenCalledWith(8);

        expect(BodyValidator.prototype.EqualToField).toHaveBeenCalledTimes(1);
        expect(BodyValidator.prototype.EqualToField).toHaveBeenCalledWith("passwordRepeat");

        expect(BodyValidator.prototype.Validate).toHaveBeenCalledTimes(1);
        expect(BodyValidator.prototype.Validate).toHaveBeenCalledWith(req);

        expect(UserToken.FetchAll).toHaveBeenCalledTimes(1);
        expect(UserToken.FetchAll).toHaveBeenCalledWith(UserToken, ["User"]);

        expect(compareSync).toHaveBeenCalledTimes(1);

        expect(hash).toHaveBeenCalledTimes(1);
        expect(hash).toHaveBeenCalledWith("12345678", 10);

        expect(userToken.CheckIfExpired).toHaveBeenCalledTimes(1);

        expect(userToken.User.Save).toHaveBeenCalledTimes(1);
        expect(userToken.User.Save).toHaveBeenCalledWith(User, userToken.User);

        expect(UserToken.Remove).toHaveBeenCalledTimes(1);
        expect(UserToken.Remove).toHaveBeenCalledWith(UserToken, userToken);

        expect(MessageHelper.prototype.Info).toHaveBeenCalledTimes(1);
        expect(MessageHelper.prototype.Info).toHaveBeenCalledWith("Your password has been reset, please now login");

        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(res.redirect).toHaveBeenCalledWith("/auth/login");
    });

    test("GIVEN query validation failed, EXPECT redirect to reset page", async () => {
        // Arrange
        const req = {
            query: {
                token: "token",
            },
            body: {
                password: "12345678",
                passwordRepeat: "12345678",
            }
        } as unknown as Request;

        const res = {
            redirect: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        const userToken = {
            Token: "token",
            Type: UserTokenType.PasswordReset,
            CheckIfExpired: jest.fn().mockResolvedValue(false),
            User: {
                UpdatePassword: jest.fn(),
                Save: jest.fn(),
            }
        }

        QueryValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        QueryValidator.prototype.Validate = jest.fn().mockResolvedValue(false);

        BodyValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        BodyValidator.prototype.MinLength = jest.fn().mockReturnThis();
        BodyValidator.prototype.EqualToField = jest.fn().mockReturnThis();
        BodyValidator.prototype.Validate = jest.fn().mockResolvedValue(true);

        UserToken.FetchAll = jest.fn().mockResolvedValue([userToken]);
        UserToken.Remove = jest.fn();

        MessageHelper.prototype.Info = jest.fn();

        const compareSync = jest.spyOn(bcryptjs, "compareSync").mockReturnValue(true);
        const hash = jest.spyOn(bcryptjs, "hash").mockResolvedValue("hashedPassword" as never);

        // Act
        const reset = new Reset();
        await reset.OnPostAsync(req, res, next);

        // Assert
        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(res.redirect).toHaveBeenCalledWith("/");
    });

    test("GIVEN body validation failed, EXPECT redirect to reset page", async () => {
        // Arrange
        const req = {
            query: {
                token: "token",
            },
            body: {
                password: "12345678",
                passwordRepeat: "12345678",
            }
        } as unknown as Request;

        const res = {
            redirect: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        const userToken = {
            Token: "token",
            Type: UserTokenType.PasswordReset,
            CheckIfExpired: jest.fn().mockResolvedValue(false),
            User: {
                UpdatePassword: jest.fn(),
                Save: jest.fn(),
            }
        }

        QueryValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        QueryValidator.prototype.Validate = jest.fn().mockResolvedValue(true);

        BodyValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        BodyValidator.prototype.MinLength = jest.fn().mockReturnThis();
        BodyValidator.prototype.EqualToField = jest.fn().mockReturnThis();
        BodyValidator.prototype.Validate = jest.fn().mockResolvedValue(false);

        UserToken.FetchAll = jest.fn().mockResolvedValue([userToken]);
        UserToken.Remove = jest.fn();

        MessageHelper.prototype.Info = jest.fn();

        const compareSync = jest.spyOn(bcryptjs, "compareSync").mockReturnValue(true);
        const hash = jest.spyOn(bcryptjs, "hash").mockResolvedValue("hashedPassword" as never);

        // Act
        const reset = new Reset();
        await reset.OnPostAsync(req, res, next);

        // Assert
        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(res.redirect).toHaveBeenCalledWith("/auth/password-reset/reset?token=token");
    });

    test("GIVEN password is null, EXPECT validation error", async () => {
        // Arrange
        const req = {
            query: {
                token: "token",
            },
            body: {
                password: null,
                passwordRepeat: "12345678",
            }
        } as unknown as Request;

        const res = {
            redirect: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        const userToken = {
            Token: "token",
            Type: UserTokenType.PasswordReset,
            CheckIfExpired: jest.fn().mockResolvedValue(false),
            User: {
                UpdatePassword: jest.fn(),
                Save: jest.fn(),
            }
        }

        QueryValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        QueryValidator.prototype.Validate = jest.fn().mockResolvedValue(true);

        BodyValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        BodyValidator.prototype.MinLength = jest.fn().mockReturnThis();
        BodyValidator.prototype.EqualToField = jest.fn().mockReturnThis();
        BodyValidator.prototype.Validate = jest.fn().mockResolvedValue(true);

        UserToken.FetchAll = jest.fn().mockResolvedValue([userToken]);
        UserToken.Remove = jest.fn();

        MessageHelper.prototype.Error = jest.fn();

        const compareSync = jest.spyOn(bcryptjs, "compareSync").mockReturnValue(true);
        const hash = jest.spyOn(bcryptjs, "hash").mockResolvedValue("hashedPassword" as never);

        // Act
        const reset = new Reset();
        await reset.OnPostAsync(req, res, next);

        // Assert
        expect(MessageHelper.prototype.Error).toHaveBeenCalledTimes(1);
        expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("Password is required");

        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(res.redirect).toHaveBeenCalledWith("/auth/password-reset/reset?token=token");
    });

    test("GIVEN password is too short, EXPECT validation error", async () => {
        // Arrange
        const req = {
            query: {
                token: "token",
            },
            body: {
                password: "1234567",
                passwordRepeat: "12345678",
            }
        } as unknown as Request;

        const res = {
            redirect: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        const userToken = {
            Token: "token",
            Type: UserTokenType.PasswordReset,
            CheckIfExpired: jest.fn().mockResolvedValue(false),
            User: {
                UpdatePassword: jest.fn(),
                Save: jest.fn(),
            }
        }

        QueryValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        QueryValidator.prototype.Validate = jest.fn().mockResolvedValue(true);

        BodyValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        BodyValidator.prototype.MinLength = jest.fn().mockReturnThis();
        BodyValidator.prototype.EqualToField = jest.fn().mockReturnThis();
        BodyValidator.prototype.Validate = jest.fn().mockResolvedValue(true);

        UserToken.FetchAll = jest.fn().mockResolvedValue([userToken]);
        UserToken.Remove = jest.fn();

        MessageHelper.prototype.Error = jest.fn();

        const compareSync = jest.spyOn(bcryptjs, "compareSync").mockReturnValue(true);
        const hash = jest.spyOn(bcryptjs, "hash").mockResolvedValue("hashedPassword" as never);

        // Act
        const reset = new Reset();
        await reset.OnPostAsync(req, res, next);

        // Assert
        expect(MessageHelper.prototype.Error).toHaveBeenCalledTimes(1);
        expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("Password must be no less than 8 characters long");

        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(res.redirect).toHaveBeenCalledWith("/auth/password-reset/reset?token=token");
    });

    test("GIVEN password does not match passwordRepeat, EXPECT validation error", async () => {
        // Arrange
        const req = {
            query: {
                token: "token",
            },
            body: {
                password: "1234567890",
                passwordRepeat: "12345678",
            }
        } as unknown as Request;

        const res = {
            redirect: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        const userToken = {
            Token: "token",
            Type: UserTokenType.PasswordReset,
            CheckIfExpired: jest.fn().mockResolvedValue(false),
            User: {
                UpdatePassword: jest.fn(),
                Save: jest.fn(),
            }
        }

        QueryValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        QueryValidator.prototype.Validate = jest.fn().mockResolvedValue(true);

        BodyValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        BodyValidator.prototype.MinLength = jest.fn().mockReturnThis();
        BodyValidator.prototype.EqualToField = jest.fn().mockReturnThis();
        BodyValidator.prototype.Validate = jest.fn().mockResolvedValue(true);

        UserToken.FetchAll = jest.fn().mockResolvedValue([userToken]);
        UserToken.Remove = jest.fn();

        MessageHelper.prototype.Error = jest.fn();

        const compareSync = jest.spyOn(bcryptjs, "compareSync").mockReturnValue(true);
        const hash = jest.spyOn(bcryptjs, "hash").mockResolvedValue("hashedPassword" as never);

        // Act
        const reset = new Reset();
        await reset.OnPostAsync(req, res, next);

        // Assert
        expect(MessageHelper.prototype.Error).toHaveBeenCalledTimes(1);
        expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("Passwords must be the same");

        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(res.redirect).toHaveBeenCalledWith("/auth/password-reset/reset?token=token");
    });

    test("GIVEN token is invalid, EXPECT 401 error", async () => {
        // Arrange
        const req = {
            query: {
                token: "token",
            },
            body: {
                password: "12345678",
                passwordRepeat: "12345678",
            }
        } as unknown as Request;

        const res = {
            redirect: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        const userToken = {
            Token: "token",
            Type: UserTokenType.PasswordReset,
            CheckIfExpired: jest.fn().mockResolvedValue(false),
            User: {
                UpdatePassword: jest.fn(),
                Save: jest.fn(),
            }
        }

        QueryValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        QueryValidator.prototype.Validate = jest.fn().mockResolvedValue(true);

        BodyValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        BodyValidator.prototype.MinLength = jest.fn().mockReturnThis();
        BodyValidator.prototype.EqualToField = jest.fn().mockReturnThis();
        BodyValidator.prototype.Validate = jest.fn().mockResolvedValue(true);

        UserToken.FetchAll = jest.fn().mockResolvedValue([userToken]);
        UserToken.Remove = jest.fn();

        MessageHelper.prototype.Info = jest.fn();

        const compareSync = jest.spyOn(bcryptjs, "compareSync").mockReturnValue(false);
        const hash = jest.spyOn(bcryptjs, "hash").mockResolvedValue("hashedPassword" as never);

        // Act
        const reset = new Reset();
        await reset.OnPostAsync(req, res, next);

        // Assert
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(createHttpError(401));
    });

    test("GIVEN token is expired, EXPECT 401 error", async () => {
        // Arrange
        const req = {
            query: {
                token: "token",
            },
            body: {
                password: "12345678",
                passwordRepeat: "12345678",
            }
        } as unknown as Request;

        const res = {
            redirect: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        const userToken = {
            Token: "token",
            Type: UserTokenType.PasswordReset,
            CheckIfExpired: jest.fn().mockResolvedValue(true),
            User: {
                UpdatePassword: jest.fn(),
                Save: jest.fn(),
            }
        }

        QueryValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        QueryValidator.prototype.Validate = jest.fn().mockResolvedValue(true);

        BodyValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        BodyValidator.prototype.MinLength = jest.fn().mockReturnThis();
        BodyValidator.prototype.EqualToField = jest.fn().mockReturnThis();
        BodyValidator.prototype.Validate = jest.fn().mockResolvedValue(true);

        UserToken.FetchAll = jest.fn().mockResolvedValue([userToken]);
        UserToken.Remove = jest.fn();

        MessageHelper.prototype.Info = jest.fn();

        const compareSync = jest.spyOn(bcryptjs, "compareSync").mockReturnValue(true);
        const hash = jest.spyOn(bcryptjs, "hash").mockResolvedValue("hashedPassword" as never);

        // Act
        const reset = new Reset();
        await reset.OnPostAsync(req, res, next);

        // Assert
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(createHttpError(401));
    });

    test("GIVEN token is not a password reset token, EXPECT 401 error", async () => {
        // Arrange
        const req = {
            query: {
                token: "token",
            },
            body: {
                password: "12345678",
                passwordRepeat: "12345678",
            }
        } as unknown as Request;

        const res = {
            redirect: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        const userToken = {
            Token: "token",
            Type: UserTokenType.Verification,
            CheckIfExpired: jest.fn().mockResolvedValue(false),
            User: {
                UpdatePassword: jest.fn(),
                Save: jest.fn(),
            }
        }

        QueryValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        QueryValidator.prototype.Validate = jest.fn().mockResolvedValue(true);

        BodyValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        BodyValidator.prototype.MinLength = jest.fn().mockReturnThis();
        BodyValidator.prototype.EqualToField = jest.fn().mockReturnThis();
        BodyValidator.prototype.Validate = jest.fn().mockResolvedValue(true);

        UserToken.FetchAll = jest.fn().mockResolvedValue([userToken]);
        UserToken.Remove = jest.fn();

        MessageHelper.prototype.Info = jest.fn();

        const compareSync = jest.spyOn(bcryptjs, "compareSync").mockReturnValue(true);
        const hash = jest.spyOn(bcryptjs, "hash").mockResolvedValue("hashedPassword" as never);

        // Act
        const reset = new Reset();
        await reset.OnPostAsync(req, res, next);

        // Assert
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(createHttpError(401));
    });
});