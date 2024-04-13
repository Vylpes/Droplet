import { User } from "../../../src/database/entities/User";
import BodyValidator from "../../../src/helpers/Validation/BodyValidator";
import AdminRegister from "../../../src/routes/auth/adminRegister";
import { Request, Response } from "express";
import createHttpError from "http-errors";
import bcryptjs from "bcryptjs";
import MessageHelper from "../../../src/helpers/MessageHelper";

describe("OnGetAsync", () => {
    test("GIVEN no user already exists, EXPECT admin register view to be rendered", async () => {
        // Arrange
        const req = {
            session: {
                User: null,
            }
        } as unknown as Request;

        const res = {
            render: jest.fn(),
            locals: {
                viewData: {},
            },
        } as unknown as Response;

        const next = jest.fn();

        User.Any = jest.fn().mockResolvedValue(false);

        // Act
        const route = new AdminRegister();
        await route.OnGetAsync(req, res, next);

        // Assert
        expect(User.Any).toHaveBeenCalledTimes(1);
        expect(User.Any).toHaveBeenCalledWith(User);

        expect(res.render).toHaveBeenCalledTimes(1);
        expect(res.render).toHaveBeenCalledWith("auth/admin-register", {});
    });

    test("GIVEN user is logged in, EXPECT 403 error", async () => {
        // Arrange
        const req = {
            session: {
                User: {},
            }
        } as unknown as Request;

        const res = {
            render: jest.fn(),
            locals: {
                viewData: {},
            },
        } as unknown as Response;

        const next = jest.fn();

        User.Any = jest.fn().mockResolvedValue(false);

        // Act
        const route = new AdminRegister();
        await route.OnGetAsync(req, res, next);

        // Assert
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(createHttpError(403));

        expect(res.render).not.toBeCalled();
    });

    test("GIVEN a user already exists, EXPECT 403 error", async () => {
        // Arrange
        const req = {
            session: {
                User: null,
            }
        } as unknown as Request;

        const res = {
            render: jest.fn(),
            locals: {
                viewData: {},
            },
        } as unknown as Response;

        const next = jest.fn();

        User.Any = jest.fn().mockResolvedValue(true);

        // Act
        const route = new AdminRegister();
        await route.OnGetAsync(req, res, next);

        // Assert
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(createHttpError(403));

        expect(res.render).not.toBeCalled();
    });
});

describe("OnPostAsync", () => {
    test("EXPECT user to be created", async () => {
        let userSaved: User | undefined;

        // Arrange
        const req = {
            session: {
                User: null,
            },
            body: {
                username: "username",
                email: "test@mail.com",
                password: "password",
            }
        } as unknown as Request;

        const res = {
            redirect: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        User.Any = jest.fn().mockResolvedValue(false);

        User.prototype.Save = jest.fn().mockImplementation((_, user: User) => {
            userSaved = user;
        });

        BodyValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        BodyValidator.prototype.ChangeField = jest.fn().mockReturnThis();
        BodyValidator.prototype.EmailAddress = jest.fn().mockReturnThis();
        BodyValidator.prototype.EqualToField = jest.fn().mockReturnThis();
        BodyValidator.prototype.WithMessage = jest.fn().mockReturnThis();
        BodyValidator.prototype.Validate = jest.fn().mockResolvedValue(true);

        const hashSpy = jest.spyOn(bcryptjs, "hash").mockResolvedValue("hashedPassword" as never);

        MessageHelper.prototype.Info = jest.fn();

        // Act
        const route = new AdminRegister();
        await route.OnPostAsync(req, res, next);

        // Assert
        expect(User.Any).toBeCalledTimes(1);
        expect(User.Any).toHaveBeenCalledWith(User);

        expect(BodyValidator.prototype.NotEmpty).toHaveBeenCalledTimes(4);

        expect(BodyValidator.prototype.ChangeField).toHaveBeenCalledTimes(3);
        expect(BodyValidator.prototype.ChangeField).toHaveBeenCalledWith("email");
        expect(BodyValidator.prototype.ChangeField).toHaveBeenCalledWith("password");
        expect(BodyValidator.prototype.ChangeField).toHaveBeenCalledWith("passwordRepeat");

        expect(BodyValidator.prototype.EmailAddress).toBeCalledTimes(1);

        expect(BodyValidator.prototype.EqualToField).toHaveBeenCalledTimes(1);
        expect(BodyValidator.prototype.EqualToField).toHaveBeenCalledWith("password");

        expect(BodyValidator.prototype.WithMessage).toHaveBeenCalledTimes(1);
        expect(BodyValidator.prototype.WithMessage).toHaveBeenCalledWith("Passwords do not match");

        expect(BodyValidator.prototype.Validate).toHaveBeenCalledTimes(1);
        expect(BodyValidator.prototype.Validate).toHaveBeenCalledWith(req);

        expect(hashSpy).toHaveBeenCalledTimes(1);
        expect(hashSpy).toHaveBeenCalledWith("password", 10);

        expect(User.prototype.Save).toHaveBeenCalledTimes(1);

        expect(userSaved).toBeDefined();
        expect(userSaved?.Email).toBe("test@mail.com");
        expect(userSaved?.Username).toBe("username");
        expect(userSaved?.Password).toBe("hashedPassword");
        expect(userSaved?.Active).toBe(true);
        expect(userSaved?.Verified).toBe(true);
        expect(userSaved?.Admin).toBe(true);

        expect(MessageHelper.prototype.Info).toBeCalledTimes(1);
        expect(MessageHelper.prototype.Info).toBeCalledWith("Successfully registered admin user");

        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(res.redirect).toHaveBeenCalledWith("/");
    });

    test("GIVEN user is logged in, EXPECT 403 error", async () => {
        let userSaved: User | undefined;

        // Arrange
        const req = {
            session: {
                User: {},
            },
            body: {
                username: "username",
                email: "test@mail.com",
                password: "password",
            }
        } as unknown as Request;

        const res = {
            redirect: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        User.Any = jest.fn().mockResolvedValue(false);

        User.prototype.Save = jest.fn().mockImplementation((_, user: User) => {
            userSaved = user;
        });

        BodyValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        BodyValidator.prototype.ChangeField = jest.fn().mockReturnThis();
        BodyValidator.prototype.EmailAddress = jest.fn().mockReturnThis();
        BodyValidator.prototype.EqualToField = jest.fn().mockReturnThis();
        BodyValidator.prototype.WithMessage = jest.fn().mockReturnThis();
        BodyValidator.prototype.Validate = jest.fn().mockResolvedValue(true);

        const hashSpy = jest.spyOn(bcryptjs, "hash").mockResolvedValue("hashedPassword" as never);

        MessageHelper.prototype.Info = jest.fn();

        // Act
        const route = new AdminRegister();
        await route.OnPostAsync(req, res, next);

        // Assert
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(createHttpError(403));

        expect(res.redirect).not.toHaveBeenCalled();
    });

    test("GIVEN a user already exists, EXPECT 403 error", async () => {
        let userSaved: User | undefined;

        // Arrange
        const req = {
            session: {
                User: null,
            },
            body: {
                username: "username",
                email: "test@mail.com",
                password: "password",
            }
        } as unknown as Request;

        const res = {
            redirect: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        User.Any = jest.fn().mockResolvedValue(true);

        User.prototype.Save = jest.fn().mockImplementation((_, user: User) => {
            userSaved = user;
        });

        BodyValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        BodyValidator.prototype.ChangeField = jest.fn().mockReturnThis();
        BodyValidator.prototype.EmailAddress = jest.fn().mockReturnThis();
        BodyValidator.prototype.EqualToField = jest.fn().mockReturnThis();
        BodyValidator.prototype.WithMessage = jest.fn().mockReturnThis();
        BodyValidator.prototype.Validate = jest.fn().mockResolvedValue(true);

        const hashSpy = jest.spyOn(bcryptjs, "hash").mockResolvedValue("hashedPassword" as never);

        MessageHelper.prototype.Info = jest.fn();

        // Act
        const route = new AdminRegister();
        await route.OnPostAsync(req, res, next);

        // Assert
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(createHttpError(403));

        expect(res.redirect).not.toHaveBeenCalled();
    });

    test("GIVEN validation failed, EXPECT error", async () => {
        let userSaved: User | undefined;

        // Arrange
        const req = {
            session: {
                User: null,
            },
            body: {
                username: "username",
                email: "test@mail.com",
                password: "password",
            }
        } as unknown as Request;

        const res = {
            redirect: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        User.Any = jest.fn().mockResolvedValue(false);

        User.prototype.Save = jest.fn().mockImplementation((_, user: User) => {
            userSaved = user;
        });

        BodyValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        BodyValidator.prototype.ChangeField = jest.fn().mockReturnThis();
        BodyValidator.prototype.EmailAddress = jest.fn().mockReturnThis();
        BodyValidator.prototype.EqualToField = jest.fn().mockReturnThis();
        BodyValidator.prototype.WithMessage = jest.fn().mockReturnThis();
        BodyValidator.prototype.Validate = jest.fn().mockResolvedValue(false);

        const hashSpy = jest.spyOn(bcryptjs, "hash").mockResolvedValue("hashedPassword" as never);

        MessageHelper.prototype.Info = jest.fn();

        // Act
        const route = new AdminRegister();
        await route.OnPostAsync(req, res, next);

        // Assert
        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(res.redirect).toHaveBeenCalledWith("/auth/admin-register");
    });
});