import { User } from "../../../src/database/entities/User";
import MessageHelper from "../../../src/helpers/MessageHelper";
import BodyValidator from "../../../src/helpers/Validation/BodyValidator";
import Login from "../../../src/routes/auth/login";
import { Request, Response } from "express";

describe("OnGet", ( ) => {
    test("GIVEN user is logged in, EXPECT redirect to dashboard", () => {
        // Arrange
        const req = {} as unknown as Request;

        const res = {
            locals: {
                viewData: {
                    isAuthenticated: true,
                }
            },
            redirect: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        // Act
        const route = new Login();
        route.OnGet(req, res, next);

        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(res.redirect).toHaveBeenCalledWith("/dashboard");
    });

    test("GIVEN user is not logged in, EXPECT view to be rendered", () => {
        // Arrange
        const req = {} as unknown as Request;

        const res = {
            locals: {
                viewData: {
                    isAuthenticated: false,
                }
            },
            render: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        // Act
        const route = new Login();
        route.OnGet(req, res, next);

        expect(res.render).toHaveBeenCalledTimes(1);
        expect(res.render).toHaveBeenCalledWith("auth/login", res.locals.viewData);
    });
});

describe("OnPostAsync", ( ) => {
    test("EXPECT login to be successful", async () => {
        // Arrange
        const req = {
            body: {
                email: "test@mail.com",
                password: "password",
            },
            session: {
                regenerate: jest.fn().mockImplementation(async (callback: Function) => {
                    await callback();
                }),
                save: jest.fn().mockImplementation((async (callback: Function) => {
                    await callback();
                })),
            }
        } as unknown as Request;

        const res = {
            redirect: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        const user = {
            Active: true,
        };

        BodyValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        BodyValidator.prototype.EmailAddress = jest.fn().mockReturnThis();
        BodyValidator.prototype.ChangeField = jest.fn().mockReturnThis();
        BodyValidator.prototype.Validate = jest.fn().mockResolvedValue(true);

        User.FetchOneByEmail = jest.fn().mockResolvedValue(user);
        User.IsLoginCorrect = jest.fn().mockResolvedValue(true);

        // Act
        const route = new Login();
        await route.OnPostAsync(req, res, next);

        // Assert
        expect(BodyValidator.prototype.NotEmpty).toHaveBeenCalledTimes(2);

        expect(BodyValidator.prototype.EmailAddress).toHaveBeenCalledTimes(1);

        expect(BodyValidator.prototype.ChangeField).toHaveBeenCalledTimes(1);
        expect(BodyValidator.prototype.ChangeField).toHaveBeenCalledWith("password");

        expect(BodyValidator.prototype.Validate).toHaveBeenCalledTimes(1);
        expect(BodyValidator.prototype.Validate).toHaveBeenCalledWith(req);

        expect(User.FetchOneByEmail).toHaveBeenCalledTimes(1);
        expect(User.FetchOneByEmail).toHaveBeenCalledWith("test@mail.com");

        expect(User.IsLoginCorrect).toHaveBeenCalledTimes(1);
        expect(User.IsLoginCorrect).toHaveBeenCalledWith("test@mail.com", "password");

        expect(req.session.regenerate).toHaveBeenCalledTimes(1);

        expect((req.session as any).User).toBe(user);

        expect(req.session.save).toHaveBeenCalledTimes(1);

        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(res.redirect).toHaveBeenCalledWith("/dashboard");
    });

    test("GIVEN validator failed, EXPECT redirect", async () => {
        // Arrange
        const req = {
            body: {
                email: "test@mail.com",
                password: "password",
            },
            session: {
                regenerate: jest.fn().mockImplementation(async (callback: Function) => {
                    await callback();
                }),
                save: jest.fn().mockImplementation((async (callback: Function) => {
                    await callback();
                })),
            }
        } as unknown as Request;

        const res = {
            redirect: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        const user = {
            Active: true,
        };

        BodyValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        BodyValidator.prototype.EmailAddress = jest.fn().mockReturnThis();
        BodyValidator.prototype.ChangeField = jest.fn().mockReturnThis();
        BodyValidator.prototype.Validate = jest.fn().mockResolvedValue(false);

        User.FetchOneByEmail = jest.fn().mockResolvedValue(user);
        User.IsLoginCorrect = jest.fn().mockResolvedValue(true);

        // Act
        const route = new Login();
        await route.OnPostAsync(req, res, next);

        // Assert
        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(res.redirect).toHaveBeenCalledWith("/auth/login");

        expect(User.FetchOneByEmail).not.toHaveBeenCalled();
    })

    test("GIVEN user is not found, EXPECT redirect to login page", async () => {
        // Arrange
        const req = {
            body: {
                email: "test@mail.com",
                password: "password",
            },
            session: {
                regenerate: jest.fn().mockImplementation(async (callback: Function) => {
                    await callback();
                }),
                save: jest.fn().mockImplementation((async (callback: Function) => {
                    await callback();
                })),
            }
        } as unknown as Request;

        const res = {
            redirect: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        BodyValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        BodyValidator.prototype.EmailAddress = jest.fn().mockReturnThis();
        BodyValidator.prototype.ChangeField = jest.fn().mockReturnThis();
        BodyValidator.prototype.Validate = jest.fn().mockResolvedValue(true);

        User.FetchOneByEmail = jest.fn().mockResolvedValue(null);
        User.IsLoginCorrect = jest.fn().mockResolvedValue(true);

        MessageHelper.prototype.Error = jest.fn();

        // Act
        const route = new Login();
        await route.OnPostAsync(req, res, next);

        // Assert
        expect(MessageHelper.prototype.Error).toHaveBeenCalledTimes(1);
        expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("Your account has been deactivated.");

        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(res.redirect).toHaveBeenCalledWith("/auth/login");
    });

    test("GIVEN user is inactive, EXPECT redirect to login page", async () => {
        // Arrange
        const req = {
            body: {
                email: "test@mail.com",
                password: "password",
            },
            session: {
                regenerate: jest.fn().mockImplementation(async (callback: Function) => {
                    await callback();
                }),
                save: jest.fn().mockImplementation((async (callback: Function) => {
                    await callback();
                })),
            }
        } as unknown as Request;

        const res = {
            redirect: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        const user = {
            Active: false,
        };

        BodyValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        BodyValidator.prototype.EmailAddress = jest.fn().mockReturnThis();
        BodyValidator.prototype.ChangeField = jest.fn().mockReturnThis();
        BodyValidator.prototype.Validate = jest.fn().mockResolvedValue(true);

        User.FetchOneByEmail = jest.fn().mockResolvedValue(user);
        User.IsLoginCorrect = jest.fn().mockResolvedValue(true);

        MessageHelper.prototype.Error = jest.fn();

        // Act
        const route = new Login();
        await route.OnPostAsync(req, res, next);

        // Assert
        expect(MessageHelper.prototype.Error).toHaveBeenCalledTimes(1);
        expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("Your account has been deactivated.");

        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(res.redirect).toHaveBeenCalledWith("/auth/login");
    });

    test("GIVEN password is incorrect, EXPECT redirect to login page", async () => {
        // Arrange
        const req = {
            body: {
                email: "test@mail.com",
                password: "password",
            },
            session: {
                regenerate: jest.fn().mockImplementation(async (callback: Function) => {
                    await callback();
                }),
                save: jest.fn().mockImplementation((async (callback: Function) => {
                    await callback();
                })),
            }
        } as unknown as Request;

        const res = {
            redirect: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        const user = {
            Active: true,
        };

        BodyValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        BodyValidator.prototype.EmailAddress = jest.fn().mockReturnThis();
        BodyValidator.prototype.ChangeField = jest.fn().mockReturnThis();
        BodyValidator.prototype.Validate = jest.fn().mockResolvedValue(true);

        User.FetchOneByEmail = jest.fn().mockResolvedValue(user);
        User.IsLoginCorrect = jest.fn().mockResolvedValue(false);

        MessageHelper.prototype.Error = jest.fn();

        // Act
        const route = new Login();
        await route.OnPostAsync(req, res, next);

        // Assert
        expect(MessageHelper.prototype.Error).toHaveBeenCalledTimes(1);
        expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("Password is incorrect");

        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(res.redirect).toHaveBeenCalledWith("/auth/login");
    });
});