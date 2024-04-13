import UserToken from "../../../src/database/entities/UserToken";
import QueryValidator from "../../../src/helpers/Validation/QueryValidator";
import Verify from "../../../src/routes/auth/verify";
import { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import { UserTokenType } from "../../../src/constants/UserTokenType";
import createHttpError from "http-errors";
import BodyValidator from "../../../src/helpers/Validation/BodyValidator";
import { User } from "../../../src/database/entities/User";
import MessageHelper from "../../../src/helpers/MessageHelper";

beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
})

describe("OnGetAsync", () => {
    test("EXPECT page to be rendered", async () => {
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

        const token = {
            Token: "token",
            Type: UserTokenType.Verification,
            CheckIfExpired: jest.fn().mockResolvedValue(false),
            User: {},
        };

        QueryValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        QueryValidator.prototype.Validate = jest.fn().mockResolvedValue(true);

        UserToken.FetchAll = jest.fn().mockResolvedValue([ token ]);

        const compareSpy = jest.spyOn(bcryptjs, "compareSync").mockReturnValue(true);

        // Act
        const route = new Verify();
        await route.OnGetAsync(req, res, next);

        // Assert
        expect(QueryValidator.prototype.NotEmpty).toHaveBeenCalledTimes(1);

        expect(QueryValidator.prototype.Validate).toHaveBeenCalledTimes(1);
        expect(QueryValidator.prototype.Validate).toHaveBeenCalledWith(req);

        expect(UserToken.FetchAll).toHaveBeenCalledTimes(1);
        expect(UserToken.FetchAll).toHaveBeenCalledWith(UserToken, [ "User" ]);

        expect(compareSpy).toHaveBeenCalledTimes(1);
        expect(compareSpy).toHaveBeenCalledWith("token", "token");

        expect(token.CheckIfExpired).toHaveBeenCalledTimes(1);

        expect(res.render).toHaveBeenCalledTimes(1);
        expect(res.render).toHaveBeenCalledWith("auth/verify");
    });

    test("GIVEN validator failed, EXPECT redirect", async () => {
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
            redirect: jest.fn(),
            locals: {},
        } as unknown as Response;

        const next = jest.fn();

        const token = {
            Token: "token",
            Type: UserTokenType.Verification,
            CheckIfExpired: jest.fn().mockResolvedValue(false),
            User: {},
        };

        QueryValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        QueryValidator.prototype.Validate = jest.fn().mockResolvedValue(false);

        UserToken.FetchAll = jest.fn().mockResolvedValue([ token ]);

        const compareSpy = jest.spyOn(bcryptjs, "compareSync").mockReturnValue(true);

        // Act
        const route = new Verify();
        await route.OnGetAsync(req, res, next);

        // Assert
        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(res.redirect).toHaveBeenCalledWith("/");
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

        const token = {
            Token: "token",
            Type: UserTokenType.Verification,
            CheckIfExpired: jest.fn().mockResolvedValue(false),
            User: {},
        };

        QueryValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        QueryValidator.prototype.Validate = jest.fn().mockResolvedValue(true);

        UserToken.FetchAll = jest.fn().mockResolvedValue([ token ]);

        const compareSpy = jest.spyOn(bcryptjs, "compareSync").mockReturnValue(true);

        // Act
        const route = new Verify();
        await route.OnGetAsync(req, res, next);

        // Assert
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(createHttpError(403));
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

        const token = {
            Token: "token",
            Type: UserTokenType.Verification,
            CheckIfExpired: jest.fn().mockResolvedValue(false),
            User: {},
        };

        QueryValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        QueryValidator.prototype.Validate = jest.fn().mockResolvedValue(true);

        UserToken.FetchAll = jest.fn().mockResolvedValue([ token ]);

        const compareSpy = jest.spyOn(bcryptjs, "compareSync").mockReturnValue(false);

        // Act
        const route = new Verify();
        await route.OnGetAsync(req, res, next);

        // Assert
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(createHttpError(401));
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

        const token = {
            Token: "token",
            Type: UserTokenType.Verification,
            CheckIfExpired: jest.fn().mockResolvedValue(true),
            User: {},
        };

        QueryValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        QueryValidator.prototype.Validate = jest.fn().mockResolvedValue(true);

        UserToken.FetchAll = jest.fn().mockResolvedValue([ token ]);

        const compareSpy = jest.spyOn(bcryptjs, "compareSync").mockReturnValue(true);

        // Act
        const route = new Verify();
        await route.OnGetAsync(req, res, next);

        // Assert
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(createHttpError(401));
    });

    test("GIVEN token is not a verification token, EXPECT 401 error", async () => {
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

        const token = {
            Token: "token",
            Type: UserTokenType.PasswordReset,
            CheckIfExpired: jest.fn().mockResolvedValue(false),
            User: {},
        };

        QueryValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        QueryValidator.prototype.Validate = jest.fn().mockResolvedValue(true);

        UserToken.FetchAll = jest.fn().mockResolvedValue([ token ]);

        const compareSpy = jest.spyOn(bcryptjs, "compareSync").mockReturnValue(true);

        // Act
        const route = new Verify();
        await route.OnGetAsync(req, res, next);

        // Assert
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(createHttpError(401));
    });
});

describe("OnPostAsync", () => {
    test("EXPECT verification to be successful", async () => {
        // Arrange
        const req = {
            query: {
                token: "token",
            },
            body: {
                password: "password",
                passwordRepeat: "password",
            }
        } as unknown as Request;

        const res = {
            redirect: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        const token = {
            Token: "token",
            Type: UserTokenType.Verification,
            CheckIfExpired: jest.fn().mockResolvedValue(false),
            User: {
                UpdatePassword: jest.fn(),
                Verify: jest.fn(),
                Save: jest.fn(),
            }
        };

        QueryValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        QueryValidator.prototype.Validate = jest.fn().mockResolvedValue(true);

        BodyValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        BodyValidator.prototype.MinLength = jest.fn().mockReturnThis();
        BodyValidator.prototype.EqualToField = jest.fn().mockReturnThis();
        BodyValidator.prototype.WithMessage = jest.fn().mockReturnThis();
        BodyValidator.prototype.Validate = jest.fn().mockResolvedValue(true);

        UserToken.FetchAll = jest.fn().mockResolvedValue([ token ]);
        UserToken.Remove = jest.fn();

        const compareSpy = jest.spyOn(bcryptjs, "compareSync").mockReturnValue(true);
        const hashSpy = jest.spyOn(bcryptjs, "hash").mockResolvedValue("hashedPassword" as never);

        MessageHelper.prototype.Info = jest.fn();

        // Act
        const route = new Verify();
        await route.OnPostAsync(req, res, next);

        // Assert
        expect(QueryValidator.prototype.NotEmpty).toHaveBeenCalledTimes(1);

        expect(QueryValidator.prototype.Validate).toHaveBeenCalledTimes(1);
        expect(QueryValidator.prototype.Validate).toHaveBeenCalledWith(req);

        expect(BodyValidator.prototype.NotEmpty).toHaveBeenCalledTimes(1);

        expect(BodyValidator.prototype.MinLength).toHaveBeenCalledTimes(1);
        expect(BodyValidator.prototype.MinLength).toHaveBeenCalledWith(8);

        expect(BodyValidator.prototype.EqualToField).toHaveBeenCalledTimes(1);
        expect(BodyValidator.prototype.EqualToField).toHaveBeenCalledWith("passwordRepeat");

        expect(BodyValidator.prototype.WithMessage).toHaveBeenCalledTimes(1);
        expect(BodyValidator.prototype.WithMessage).toHaveBeenCalledWith("Passwords must match");

        expect(BodyValidator.prototype.Validate).toHaveBeenCalledTimes(1);
        expect(BodyValidator.prototype.Validate).toHaveBeenCalledWith(req);

        expect(UserToken.FetchAll).toHaveBeenCalledTimes(1);
        expect(UserToken.FetchAll).toHaveBeenCalledWith(UserToken, [ "User" ]);

        expect(compareSpy).toHaveBeenCalledTimes(1);
        expect(compareSpy).toHaveBeenCalledWith("token", "token");

        expect(token.CheckIfExpired).toHaveBeenCalledTimes(1);

        expect(hashSpy).toHaveBeenCalledTimes(1);
        expect(hashSpy).toHaveBeenCalledWith("password", 10);

        expect(token.User.UpdatePassword).toHaveBeenCalledTimes(1);
        expect(token.User.UpdatePassword).toHaveBeenCalledWith("hashedPassword");

        expect(token.User.Verify).toHaveBeenCalledTimes(1);

        expect(token.User.Save).toHaveBeenCalledTimes(1);
        expect(token.User.Save).toHaveBeenCalledWith(User, token.User);

        expect(UserToken.Remove).toHaveBeenCalledTimes(1);
        expect(UserToken.Remove).toHaveBeenCalledWith(UserToken, token);

        expect(MessageHelper.prototype.Info).toHaveBeenCalledTimes(1);
        expect(MessageHelper.prototype.Info).toHaveBeenCalledWith("You are now verified, please now login");

        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(res.redirect).toHaveBeenCalledWith("/auth/login");
    });

    test("GIVEN query validaiton failed, EXPECT redirect", async () => {
        // Arrange
        const req = {
            query: {
                token: "token",
            },
            body: {
                password: "password",
                passwordRepeat: "password",
            }
        } as unknown as Request;

        const res = {
            redirect: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        const token = {
            Token: "token",
            Type: UserTokenType.Verification,
            CheckIfExpired: jest.fn().mockResolvedValue(false),
            User: {
                UpdatePassword: jest.fn(),
                Verify: jest.fn(),
                Save: jest.fn(),
            }
        };

        QueryValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        QueryValidator.prototype.Validate = jest.fn().mockResolvedValue(false);

        BodyValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        BodyValidator.prototype.MinLength = jest.fn().mockReturnThis();
        BodyValidator.prototype.EqualToField = jest.fn().mockReturnThis();
        BodyValidator.prototype.WithMessage = jest.fn().mockReturnThis();
        BodyValidator.prototype.Validate = jest.fn().mockResolvedValue(true);

        UserToken.FetchAll = jest.fn().mockResolvedValue([ token ]);
        UserToken.Remove = jest.fn();

        const compareSpy = jest.spyOn(bcryptjs, "compareSync").mockReturnValue(true);
        const hashSpy = jest.spyOn(bcryptjs, "hash").mockResolvedValue("hashedPassword" as never);

        MessageHelper.prototype.Info = jest.fn();

        // Act
        const route = new Verify();
        await route.OnPostAsync(req, res, next);

        // Assert
        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(res.redirect).toHaveBeenCalledWith("/");
    });

    test("GIVEN body validation failed, EXPECT redirect", async () => {
        // Arrange
        const req = {
            query: {
                token: "token",
            },
            body: {
                password: "password",
                passwordRepeat: "password",
            }
        } as unknown as Request;

        const res = {
            redirect: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        const token = {
            Token: "token",
            Type: UserTokenType.Verification,
            CheckIfExpired: jest.fn().mockResolvedValue(false),
            User: {
                UpdatePassword: jest.fn(),
                Verify: jest.fn(),
                Save: jest.fn(),
            }
        };

        QueryValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        QueryValidator.prototype.Validate = jest.fn().mockResolvedValue(true);

        BodyValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        BodyValidator.prototype.MinLength = jest.fn().mockReturnThis();
        BodyValidator.prototype.EqualToField = jest.fn().mockReturnThis();
        BodyValidator.prototype.WithMessage = jest.fn().mockReturnThis();
        BodyValidator.prototype.Validate = jest.fn().mockResolvedValue(false);

        UserToken.FetchAll = jest.fn().mockResolvedValue([ token ]);
        UserToken.Remove = jest.fn();

        const compareSpy = jest.spyOn(bcryptjs, "compareSync").mockReturnValue(true);
        const hashSpy = jest.spyOn(bcryptjs, "hash").mockResolvedValue("hashedPassword" as never);

        MessageHelper.prototype.Info = jest.fn();

        // Act
        const route = new Verify();
        await route.OnPostAsync(req, res, next);

        // Assert
        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(res.redirect).toHaveBeenCalledWith("/auth/verify?token=token");
    });

    test("GIVEN token is invalid, EXPECT 401 error", async () => {
        // Arrange
        const req = {
            query: {
                token: "token",
            },
            body: {
                password: "password",
                passwordRepeat: "password",
            }
        } as unknown as Request;

        const res = {
            redirect: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        const token = {
            Token: "token",
            Type: UserTokenType.Verification,
            CheckIfExpired: jest.fn().mockResolvedValue(false),
            User: {
                UpdatePassword: jest.fn(),
                Verify: jest.fn(),
                Save: jest.fn(),
            }
        };

        QueryValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        QueryValidator.prototype.Validate = jest.fn().mockResolvedValue(true);

        BodyValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        BodyValidator.prototype.MinLength = jest.fn().mockReturnThis();
        BodyValidator.prototype.EqualToField = jest.fn().mockReturnThis();
        BodyValidator.prototype.WithMessage = jest.fn().mockReturnThis();
        BodyValidator.prototype.Validate = jest.fn().mockResolvedValue(true);

        UserToken.FetchAll = jest.fn().mockResolvedValue([ token ]);
        UserToken.Remove = jest.fn();

        const compareSpy = jest.spyOn(bcryptjs, "compareSync").mockReturnValue(false);
        const hashSpy = jest.spyOn(bcryptjs, "hash").mockResolvedValue("hashedPassword" as never);

        MessageHelper.prototype.Info = jest.fn();

        // Act
        const route = new Verify();
        await route.OnPostAsync(req, res, next);

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
                password: "password",
                passwordRepeat: "password",
            }
        } as unknown as Request;

        const res = {
            redirect: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        const token = {
            Token: "token",
            Type: UserTokenType.Verification,
            CheckIfExpired: jest.fn().mockResolvedValue(true),
            User: {
                UpdatePassword: jest.fn(),
                Verify: jest.fn(),
                Save: jest.fn(),
            }
        };

        QueryValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        QueryValidator.prototype.Validate = jest.fn().mockResolvedValue(true);

        BodyValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        BodyValidator.prototype.MinLength = jest.fn().mockReturnThis();
        BodyValidator.prototype.EqualToField = jest.fn().mockReturnThis();
        BodyValidator.prototype.WithMessage = jest.fn().mockReturnThis();
        BodyValidator.prototype.Validate = jest.fn().mockResolvedValue(true);

        UserToken.FetchAll = jest.fn().mockResolvedValue([ token ]);
        UserToken.Remove = jest.fn();

        const compareSpy = jest.spyOn(bcryptjs, "compareSync").mockReturnValue(true);
        const hashSpy = jest.spyOn(bcryptjs, "hash").mockResolvedValue("hashedPassword" as never);

        MessageHelper.prototype.Info = jest.fn();

        // Act
        const route = new Verify();
        await route.OnPostAsync(req, res, next);

        // Assert
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(createHttpError(401));
    });

    test("GIVEN token is not a verification token, EXPECT 401 error", async () => {
        // Arrange
        const req = {
            query: {
                token: "token",
            },
            body: {
                password: "password",
                passwordRepeat: "password",
            }
        } as unknown as Request;

        const res = {
            redirect: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        const token = {
            Token: "token",
            Type: UserTokenType.PasswordReset,
            CheckIfExpired: jest.fn().mockResolvedValue(false),
            User: {
                UpdatePassword: jest.fn(),
                Verify: jest.fn(),
                Save: jest.fn(),
            }
        };

        QueryValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        QueryValidator.prototype.Validate = jest.fn().mockResolvedValue(true);

        BodyValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        BodyValidator.prototype.MinLength = jest.fn().mockReturnThis();
        BodyValidator.prototype.EqualToField = jest.fn().mockReturnThis();
        BodyValidator.prototype.WithMessage = jest.fn().mockReturnThis();
        BodyValidator.prototype.Validate = jest.fn().mockResolvedValue(true);

        UserToken.FetchAll = jest.fn().mockResolvedValue([ token ]);
        UserToken.Remove = jest.fn();

        const compareSpy = jest.spyOn(bcryptjs, "compareSync").mockReturnValue(true);
        const hashSpy = jest.spyOn(bcryptjs, "hash").mockResolvedValue("hashedPassword" as never);

        MessageHelper.prototype.Info = jest.fn();

        // Act
        const route = new Verify();
        await route.OnPostAsync(req, res, next);

        // Assert
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(createHttpError(401));
    });
});