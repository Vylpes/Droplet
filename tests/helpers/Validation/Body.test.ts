import Body from '../../../src/helpers/Validation/Body';
import { Request, Response } from 'express';
import MessageHelper from '../../../src/helpers/MessageHelper';
import { ValidationRule } from '../../../src/constants/ValidationRule';

describe('constructor', () => {
    test('EXPECT properties to be set', () => {
        const body = new Body("fieldName", "/url");

        expect(body['field']).toBe('fieldName');
        expect(body['onFail']).toBe("/url");
        expect(body['rules']).toEqual([]);
    });
});

describe("Validate", () => {
    test("GIVEN whenCallback is supplied, EXPECT whenCallback to be execute", async () => {
        // Arrange
        MessageHelper.prototype.Error = jest.fn();

        const req = {
            body: { field: "field" },
        } as unknown as Request;
        const res = { redirect: jest.fn() } as unknown as Response;
        const whenCallback = jest.fn().mockReturnValue(true);
        const body = new Body("field", "/url")
            .NotEmpty()
                .When(whenCallback);

        // Act
        await body.Validate(req, res, jest.fn());

        // Assert
        expect(whenCallback).toHaveBeenCalledWith(req);
    });

    test("GIVEN whenCallback is not supplied, EXPECT validation to be executed", async () => {
        // Arrange
        MessageHelper.prototype.Error = jest.fn();

        const req = {
            body: { field: "" },
        } as unknown as Request;
        const res = { redirect: jest.fn() } as unknown as Response;
        const whenCallback = jest.fn().mockReturnValue(true);
        const body = new Body("field", "/url")
            .NotEmpty();

        // Act
        await body.Validate(req, res, jest.fn());

        // Assert
        expect(whenCallback).not.toHaveBeenCalled();
        expect(MessageHelper.prototype.Error).toHaveBeenCalled(); // Validation is setup to fail so we know it has been executed if this is called
    });

    test("GIVEN whenCallback returns false, EXPECT validation to be skipped", async () => {
        // Arrange
        MessageHelper.prototype.Error = jest.fn();

        const req = {
            body: { field: "" },
            flash: jest.fn(),
        } as unknown as Request;
        const res = { redirect: jest.fn() } as unknown as Response;
        const whenCallback = jest.fn().mockReturnValue(false);
        const next = jest.fn();
        const body = new Body("field", "/url")
            .NotEmpty()
                .When(whenCallback);

        // Act
        await body.Validate(req, res, next);

        // Assert
        expect(whenCallback).toHaveBeenCalledWith(req);
        expect(MessageHelper.prototype.Error).not.toHaveBeenCalled(); // Validation is setup to fail so we know it has been executed if this is called
    });

    test("GIVEN whenCallback returns true, EXPECT validation to be executed", async () => {
        // Arrange
        MessageHelper.prototype.Error = jest.fn();

        const req = {
            body: { field: "" },
            flash: jest.fn(),
        } as unknown as Request;
        const res = { redirect: jest.fn() } as unknown as Response;
        const whenCallback = jest.fn().mockReturnValue(true);
        const next = jest.fn();
        const body = new Body("field", "/url")
            .NotEmpty()
                .When(whenCallback);

        // Act
        await body.Validate(req, res, next);

        // Assert
        expect(whenCallback).toHaveBeenCalledWith(req);
        expect(MessageHelper.prototype.Error).toHaveBeenCalled(); // Validation is setup to fail so we know it has been executed if this is called
    });

    describe("NotEmpty", () => {
        test("GIVEN field is not empty, EXPECT pass", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                body: { field: "field" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const body = new Body("field", "/url")
                .NotEmpty();

            // Act
            await body.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).not.toHaveBeenCalled();

        });

        test("GIVEN field is null, EXPECT fail", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                body: { field: null },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const body = new Body("field", "/url")
                .NotEmpty();

            // Act
            await body.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("field is required");

        });

        test("GIVEN field length is 0, EXPECT fail", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                body: { field: "" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const body = new Body("field", "/url")
                .NotEmpty();

            // Act
            await body.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("field is required");
        });

        test("GIVEN errorMessage is supplied, EXPECT message to be custom set", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                body: { field: "" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const body = new Body("field", "/url")
                .NotEmpty()
                    .WithMessage("custom message");

            // Act
            await body.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("custom message");

        });

        test("GIVEN onFail is not supplied, EXPECT next to be called", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                body: { field: "" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const body = new Body("field")
                .NotEmpty();

            // Act
            await body.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalled();
            expect(next).toHaveBeenCalled();

        });
    });

    describe("EqualTo", () => {
        test("GIVEN field is equal to string, EXPECT pass", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                body: { field: "field" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const body = new Body("field", "/url")
                .EqualTo("field");

            // Act
            await body.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).not.toHaveBeenCalled();

        });

        test("GIVEN field is not equal to string, EXEPCT fail", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                body: { field: "field" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const body = new Body("field", "/url")
                .EqualTo("otherField");

            // Act
            await body.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("field must be equal to otherField");
        });

        test("GIVEN errorMessage is supplied, EXPECT message to be custom set", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                body: { field: "field" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const body = new Body("field", "/url")
                .EqualTo("otherField")
                    .WithMessage("custom message");

            // Act
            await body.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("custom message");

        });

        test("GIVEN onFail is not supplied, EXPECT next to be called", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                body: { field: "field" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const body = new Body("field")
                .EqualTo("otherField");

            // Act
            await body.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalled();
            expect(next).toHaveBeenCalled();
        });
    });

    describe("NotEqualTo", () => {
        test("GIVEN field is not equal to string, EXPECT pass", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                body: { field: "field" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const body = new Body("field", "/url")
                .NotEqualTo("otherField");

            // Act
            await body.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).not.toHaveBeenCalled();
        });

        test("GIVEN field is equal to string, EXPECT fail", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                body: { field: "field" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const body = new Body("field", "/url")
                .NotEqualTo("field");

            // Act
            await body.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("field must not be equal to field");
        });

        test("GIVEN errorMessage is supplied, EXPECT message to be custom set", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                body: { field: "field" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const body = new Body("field", "/url")
                .NotEqualTo("field")
                    .WithMessage("custom message");

            // Act
            await body.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("custom message");
        });

        test("GIVEN onFail is not supplied, EXPECT next to be called", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                body: { field: "field" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const body = new Body("field")
                .NotEqualTo("field");

            // Act
            await body.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalled();
            expect(next).toHaveBeenCalled();
        });
    });

    describe("EqualToField", () => {
        test("GIVEN field is equal to other field, EXPECT pass", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                body: { field: "field", otherField: "field" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const body = new Body("field", "/url")
                .EqualToField("otherField");

            // Act
            await body.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).not.toHaveBeenCalled();
        });

        test("GIVEN field is not equal to other field, EXPECT fail", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                body: { field: "field", otherField: "otherField" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const body = new Body("field", "/url")
                .EqualToField("otherField");

            // Act
            await body.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("field must be equal to field otherField");
        });

        test("GIVEN errorMessage is supplied, EXPECT message to be custom set", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                body: { field: "field", otherField: "otherField" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const body = new Body("field", "/url")
                .EqualToField("otherField")
                    .WithMessage("custom message");

            // Act
            await body.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("custom message");
        });

        test("GIVEN onFail is not supplied, EXPECT next to be called", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                body: { field: "field", otherField: "otherField" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const body = new Body("field")
                .EqualToField("otherField");

            // Act
            await body.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalled();
            expect(next).toHaveBeenCalled();
        });
    });

    describe("NotEqualToField", () => {
        test("GIVEN field is not equal to other field, EXPECT pass", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                body: { field: "field", otherField: "otherField" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const body = new Body("field", "/url")
                .NotEqualToField("otherField");

            // Act
            await body.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).not.toHaveBeenCalled();
        });

        test("GIVEN field is equal to other field, EXPECT pass", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                body: { field: "field", otherField: "field" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const body = new Body("field", "/url")
                .NotEqualToField("otherField");

            // Act
            await body.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("field must not be equal to field otherField");
        });

        test("GIVEN errorMessage is supplied, EXPECT message to be custom set", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                body: { field: "field", otherField: "field" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const body = new Body("field", "/url")
                .NotEqualToField("otherField")
                    .WithMessage("custom message");

            // Act
            await body.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("custom message");
        });

        test("GIVEN onFail is not supplied, EXPECT next to be called", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                body: { field: "field", otherField: "field" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const body = new Body("field")
                .NotEqualToField("otherField");

            // Act
            await body.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalled();
            expect(next).toHaveBeenCalled();
        });
    });

    describe("MaxLength", () => {
        test("GIVEN field length is less than max, EXPECT pass", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                body: { field: "field" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const body = new Body("field", "/url")
                .MaxLength(10);

            // Act
            await body.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).not.toHaveBeenCalled();
        });

        test("GIVEN field length is equal to max, EXPECT pass", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                body: { field: "fieldfield" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const body = new Body("field", "/url")
                .MaxLength(10);

            // Act
            await body.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).not.toHaveBeenCalled();
        });

        test("GIVEN field length is greater than max, EXPECT fail", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                body: { field: "fieldfieldfield" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const body = new Body("field", "/url")
                .MaxLength(10);

            // Act
            await body.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("field must be no more than 10 characters long");
        });

        test("GIVEN errorMessage is supplied, EXPECT message to be custom set", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                body: { field: "fieldfieldfield" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const body = new Body("field", "/url")
                .MaxLength(10)
                    .WithMessage("custom message");

            // Act
            await body.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("custom message");
        });

        test("GIVEN onFail is not supplied, EXPECT next to be called", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                body: { field: "fieldfieldfield" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const body = new Body("field")
                .MaxLength(10);

            // Act
            await body.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalled();
            expect(next).toHaveBeenCalled();
        });
    });

    describe("MinLength", () => {
        test("GIVEN field length is greater than min, EXPECT pass", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                body: { field: "fieldfieldfield" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const body = new Body("field", "/url")
                .MinLength(10);

            // Act
            await body.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).not.toHaveBeenCalled();
        });

        test("GIVEN field length is equal to min, EXPECT pass", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                body: { field: "fieldfield" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const body = new Body("field", "/url")
                .MinLength(10);

            // Act
            await body.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).not.toHaveBeenCalled();
        });

        test("GIVEN field length is less than min, EXPECT fail", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                body: { field: "field" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const body = new Body("field", "/url")
                .MinLength(10);

            // Act
            await body.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("field must be no less than 10 characters long");
        });

        test("GIVEN errorMessage is supplied, EXPECT message to be custom set", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                body: { field: "field" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const body = new Body("field", "/url")
                .MinLength(10)
                    .WithMessage("custom message");

            // Act
            await body.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("custom message");
        });

        test("GIVEN onFail is not supplied, EXPECT next to be called", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                body: { field: "field" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const body = new Body("field")
                .MinLength(10);

            // Act
            await body.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalled();
            expect(next).toHaveBeenCalled();
        });
    });

    describe("Number", () => {
        test("GIVEN field is a number, EXPECT pass", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                body: { field: "1" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const body = new Body("field", "/url")
                .Number();

            // Act
            await body.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).not.toHaveBeenCalled();
        });

        test("GIVEN field is not a number, EXPECT fail", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                body: { field: "field" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const body = new Body("field", "/url")
                .Number();

            // Act
            await body.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("field must be a number");
        });

        test("GIVEN errorMessage is supplied, EXPECT message to be custom set", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                body: { field: "field" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const body = new Body("field", "/url")
                .Number()
                    .WithMessage("custom message");

            // Act
            await body.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("custom message");
        });

        test("GIVEN onFail is not supplied, EXPECT next to be called", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                body: { field: "field" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const body = new Body("field")
                .Number();

            // Act
            await body.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalled();
            expect(next).toHaveBeenCalled();
        });
    });

    describe("EmailAddress", () => {
        test("GIVEN field is an email, EXPECT pass", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                body: { field: "test@mail.com" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const body = new Body("field", "/url")
                .EmailAddress();

            // Act
            await body.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).not.toHaveBeenCalled();
        });

        test("GIVEN field is not an email, EXPECT fail", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                body: { field: "field" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const body = new Body("field", "/url")
                .EmailAddress();

            // Act
            await body.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("field must be an email address");
        });

        test("GIVEN errorMessage is supplied, EXPECT message to be custom set", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                body: { field: "field" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const body = new Body("field", "/url")
                .EmailAddress()
                    .WithMessage("custom message");

            // Act
            await body.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("custom message");
        });

        test("GIVEN onFail is not supplied, EXPECT next to be called", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                body: { field: "field" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const body = new Body("field")
                .EmailAddress();

            // Act
            await body.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalled();
            expect(next).toHaveBeenCalled();
        });
    });

    describe("Boolean", () => {
        test("GIVEN field is true, EXPECT pass", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                body: { field: "true" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const body = new Body("field", "/url")
                .Boolean();

            // Act
            await body.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).not.toHaveBeenCalled();
        });

        test("GIVEN field is false, EXPECT pass", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                body: { field: "false" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const body = new Body("field", "/url")
                .Boolean();

            // Act
            await body.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).not.toHaveBeenCalled();
        });

        test("GIVEN field is not a boolean, EXPECT fail", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                body: { field: "field" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const body = new Body("field", "/url")
                .Boolean();

            // Act
            await body.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("field must be a boolean");
        });

        test("GIVEN errorMessage is supplied, EXPECT message to be custom set", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                body: { field: "field" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const body = new Body("field", "/url")
                .Boolean()
                    .WithMessage("custom message");

            // Act
            await body.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("custom message");
        });

        test("GIVEN onFail is not supplied, EXPECT next to be called", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                body: { field: "field" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const body = new Body("field")
                .Boolean();

            // Act
            await body.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalled();
            expect(next).toHaveBeenCalled();
        });
    });

    describe("GreaterThan", () => {
        test("GIVEN field is greater than value, EXPECT pass", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                body: { field: "6" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const body = new Body("field", "/url")
                .GreaterThan(5);

            // Act
            await body.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).not.toHaveBeenCalled();
        });

        test("GIVEN field is equal to value, EXPECT fail", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                body: { field: "5" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const body = new Body("field", "/url")
                .GreaterThan(5);

            // Act
            await body.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("field must be greater than 5");
        });

        test("GIVEN field is less than value, EXPECT fail", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                body: { field: "4" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const body = new Body("field", "/url")
                .GreaterThan(5);

            // Act
            await body.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("field must be greater than 5");
        });

        test("GIVEN field is not a number, EXPECT fail", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                body: { field: "field" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const body = new Body("field", "/url")
                .GreaterThan(5);

            // Act
            await body.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("field must be greater than 5");
        });

        test("GIVEN errorMessage is supplied, EXPECT message to be custom set", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                body: { field: "4" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const body = new Body("field")
                .GreaterThan(5)
                    .WithMessage("custom message");

            // Act
            await body.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("custom message");
        });

        test("GIVEN onFail is not supplied, EXPECT next to be called", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                body: { field: "4" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const body = new Body("field")
                .GreaterThan(5);

            // Act
            await body.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalled();
            expect(next).toHaveBeenCalled();
        });
    });

    describe("LessThan", () => {
        test("GIVEN field is less than value, EXPECT pass", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                body: { field: "4" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const body = new Body("field", "/url")
                .LessThan(5);

            // Act
            await body.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).not.toHaveBeenCalled();
        });

        test("GIVEN field is equal to value, EXPECT fail", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                body: { field: "5" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const body = new Body("field", "/url")
                .LessThan(5);

            // Act
            await body.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("field must be less than 5");
        });

        test("GIVEN field is greater than value, EXPECT fail", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                body: { field: "6" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const body = new Body("field", "/url")
                .LessThan(5);

            // Act
            await body.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("field must be less than 5");
        });

        test("GIVEN field is not a number, EXPECT fail", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                body: { field: "field" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const body = new Body("field", "/url")
                .LessThan(5);

            // Act
            await body.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("field must be less than 5");
        });

        test("GIVEN errorMessage is supplied, EXPECT message to be custom set", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                body: { field: "6" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const body = new Body("field")
                .LessThan(5)
                    .WithMessage("custom message");

            // Act
            await body.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("custom message");
        });

        test("GIVEN onFail is not supplied, EXPECT next to be called", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                body: { field: "6" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const body = new Body("field")
                .LessThan(5);

            // Act
            await body.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalled();
            expect(next).toHaveBeenCalled();
        });
    });
});

describe('NotEmpty', () => {
    test('EXPECT rule to be pushed', () => {
        const body = new Body('field');

        body.NotEmpty();
        expect(body['rules']).toEqual([{ field: 'field', rule: ValidationRule.NotEmpty }]);
    });
});

describe('EqualTo', () => {
    test('EXPECT rule to be pushed', () => {
        const body = new Body('field');

        body.EqualTo('value');
        expect(body['rules']).toEqual([{ field: 'field', rule: ValidationRule.EqualTo, to: 'value' }]);
    });
});

describe('NotEqualTo', () => {
    test('EXPECT rule to be pushed', () => {
        const body = new Body('field');

        body.NotEqualTo('value');
        expect(body['rules']).toEqual([{ field: 'field', rule: ValidationRule.NotEqualTo, to: 'value' }]);
    });
});

describe('EqualToField', () => {
    test('EXPECT rule to be pushed', () => {
        const body = new Body('field');

        body.EqualToField('otherField');
        expect(body['rules']).toEqual([{ field: 'field', rule: ValidationRule.EqualToField, to: 'otherField' }]);
    });
});

describe('NotEqualToField', () => {
    test('EXPECT rule to be pushed', () => {
        const body = new Body('field');

        body.NotEqualToField('otherField');
        expect(body['rules']).toEqual([{ field: 'field', rule: ValidationRule.NotEqualToField, to: 'otherField' }]);
    });
});

describe('MaxLength', () => {
    test('EXPECT rule to be pushed', () => {
        const body = new Body('field');

        body.MaxLength(10);
        expect(body['rules']).toEqual([{ field: 'field', rule: ValidationRule.MaxLength, length: 10 }]);
    });
});

describe('MinLength', () => {
    test('EXPECT rule to be pushed', () => {
        const body = new Body('field');

        body.MinLength(5);
        expect(body['rules']).toEqual([{ field: 'field', rule: ValidationRule.MinLength, length: 5 }]);
    });
});

describe('Number', () => {
    test('EXPECT rule to be pushed', () => {
        const body = new Body('field');

        body.Number();
        expect(body['rules']).toEqual([{ field: 'field', rule: ValidationRule.Number }]);
    });
});

describe('EmailAddress', () => {
    test('EXPECT rule to be pushed', () => {
        const body = new Body('field');

        body.EmailAddress();
        expect(body['rules']).toEqual([{ field: 'field', rule: ValidationRule.EmailAddress }]);
    });
});

describe('Boolean', () => {
    test('EXPECT rule to be pushed', () => {
        const body = new Body('field');

        body.Boolean();
        expect(body['rules']).toEqual([{ field: 'field', rule: ValidationRule.Boolean }]);
    });
});

describe('GreaterThan', () => {
    test('EXPECT rule to be pushed', () => {
        const body = new Body('field');

        body.GreaterThan(5);
        expect(body['rules']).toEqual([{ field: 'field', rule: ValidationRule.GreaterThan, length: 5 }]);
    });
});

describe('LessThan', () => {
    test('EXPECT rule to be pushed', () => {
        const body = new Body('field');

        body.LessThan(10);
        expect(body['rules']).toEqual([{ field: 'field', rule: ValidationRule.LessThan, length: 10 }]);
    });
});

describe("WithMessage", () => {
    test("EXPECT message to be set", () => {
        const body = new Body("field")
            .NotEmpty()
                .WithMessage("custom message");

        expect(body['rules']).toEqual([{ field: 'field', rule: ValidationRule.NotEmpty, errorMessage: "custom message" }]);
    });

    test("GIVEN no rule, EXPECT nothing to happen", () => {
        const body = new Body("field")
            .WithMessage("custom message");

        expect(body['rules']).toEqual([]);
    });
});

describe("When", () => {
    test("EXPECT callback to be set", () => {
        const whenCallback = jest.fn();

        const body = new Body("field")
            .NotEmpty()
                .When(whenCallback);

        expect(body['rules']).toEqual([{ field: 'field', rule: ValidationRule.NotEmpty, whenCallback: whenCallback }]);
    });

    test("GIVEN no rule, EXPECT nothing to happen", () => {
        const whenCallback = jest.fn();

        const body = new Body("field")
            .When(whenCallback);

        expect(body['rules']).toEqual([]);
    });
});