import Params from '../../../src/helpers/Validation/Params';
import { Request, Response } from 'express';
import MessageHelper from '../../../src/helpers/MessageHelper';
import { ValidationRule } from '../../../src/constants/ValidationRule';

describe('constructor', () => {
    test('EXPECT properties to be set', () => {
        const params = new Params("fieldName", "/url");

        expect(params['field']).toBe('fieldName');
        expect(params['onFail']).toBe("/url");
        expect(params['rules']).toEqual([]);
    });
});

describe("Validate", () => {
    test("GIVEN whenCallback is supplied, EXPECT whenCallback to be execute", async () => {
        // Arrange
        MessageHelper.prototype.Error = jest.fn();

        const req = {
            params: { field: "field" },
        } as unknown as Request;
        const res = { redirect: jest.fn() } as unknown as Response;
        const whenCallback = jest.fn().mockReturnValue(true);
        const params = new Params("field", "/url")
            .NotEmpty()
                .When(whenCallback);

        // Act
        await params.Validate(req, res, jest.fn());

        // Assert
        expect(whenCallback).toHaveBeenCalledWith(req);
    });

    test("GIVEN whenCallback is not supplied, EXPECT validation to be executed", async () => {
        // Arrange
        MessageHelper.prototype.Error = jest.fn();

        const req = {
            params: { field: "" },
        } as unknown as Request;
        const res = { redirect: jest.fn() } as unknown as Response;
        const whenCallback = jest.fn().mockReturnValue(true);
        const params = new Params("field", "/url")
            .NotEmpty();

        // Act
        await params.Validate(req, res, jest.fn());

        // Assert
        expect(whenCallback).not.toHaveBeenCalled();
        expect(MessageHelper.prototype.Error).toHaveBeenCalled(); // Validation is setup to fail so we know it has been executed if this is called
    });

    test("GIVEN whenCallback returns false, EXPECT validation to be skipped", async () => {
        // Arrange
        MessageHelper.prototype.Error = jest.fn();

        const req = {
            params: { field: "" },
            flash: jest.fn(),
        } as unknown as Request;
        const res = { redirect: jest.fn() } as unknown as Response;
        const whenCallback = jest.fn().mockReturnValue(false);
        const next = jest.fn();
        const params = new Params("field", "/url")
            .NotEmpty()
                .When(whenCallback);

        // Act
        await params.Validate(req, res, next);

        // Assert
        expect(whenCallback).toHaveBeenCalledWith(req);
        expect(MessageHelper.prototype.Error).not.toHaveBeenCalled(); // Validation is setup to fail so we know it has been executed if this is called
    });

    test("GIVEN whenCallback returns true, EXPECT validation to be executed", async () => {
        // Arrange
        MessageHelper.prototype.Error = jest.fn();

        const req = {
            params: { field: "" },
            flash: jest.fn(),
        } as unknown as Request;
        const res = { redirect: jest.fn() } as unknown as Response;
        const whenCallback = jest.fn().mockReturnValue(true);
        const next = jest.fn();
        const params = new Params("field", "/url")
            .NotEmpty()
                .When(whenCallback);

        // Act
        await params.Validate(req, res, next);

        // Assert
        expect(whenCallback).toHaveBeenCalledWith(req);
        expect(MessageHelper.prototype.Error).toHaveBeenCalled(); // Validation is setup to fail so we know it has been executed if this is called
    });

    describe("NotEmpty", () => {
        test("GIVEN field is not empty, EXPECT pass", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                params: { field: "field" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const params = new Params("field", "/url")
                .NotEmpty();

            // Act
            await params.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).not.toHaveBeenCalled();

        });

        test("GIVEN field is null, EXPECT fail", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                params: { field: null },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const params = new Params("field", "/url")
                .NotEmpty();

            // Act
            await params.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("field is required");

        });

        test("GIVEN field length is 0, EXPECT fail", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                params: { field: "" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const params = new Params("field", "/url")
                .NotEmpty();

            // Act
            await params.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("field is required");
        });

        test("GIVEN errorMessage is supplied, EXPECT message to be custom set", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                params: { field: "" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const params = new Params("field", "/url")
                .NotEmpty()
                    .WithMessage("custom message");

            // Act
            await params.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("custom message");

        });

        test("GIVEN onFail is not supplied, EXPECT next to be called", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                params: { field: "" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const params = new Params("field")
                .NotEmpty();

            // Act
            await params.Validate(req, res, next);

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
                params: { field: "field" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const params = new Params("field", "/url")
                .EqualTo("field");

            // Act
            await params.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).not.toHaveBeenCalled();

        });

        test("GIVEN field is not equal to string, EXEPCT fail", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                params: { field: "field" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const params = new Params("field", "/url")
                .EqualTo("otherField");

            // Act
            await params.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("field must be equal to otherField");
        });

        test("GIVEN errorMessage is supplied, EXPECT message to be custom set", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                params: { field: "field" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const params = new Params("field", "/url")
                .EqualTo("otherField")
                    .WithMessage("custom message");

            // Act
            await params.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("custom message");

        });

        test("GIVEN onFail is not supplied, EXPECT next to be called", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                params: { field: "field" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const params = new Params("field")
                .EqualTo("otherField");

            // Act
            await params.Validate(req, res, next);

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
                params: { field: "field" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const params = new Params("field", "/url")
                .NotEqualTo("otherField");

            // Act
            await params.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).not.toHaveBeenCalled();
        });

        test("GIVEN field is equal to string, EXPECT fail", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                params: { field: "field" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const params = new Params("field", "/url")
                .NotEqualTo("field");

            // Act
            await params.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("field must not be equal to field");
        });

        test("GIVEN errorMessage is supplied, EXPECT message to be custom set", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                params: { field: "field" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const params = new Params("field", "/url")
                .NotEqualTo("field")
                    .WithMessage("custom message");

            // Act
            await params.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("custom message");
        });

        test("GIVEN onFail is not supplied, EXPECT next to be called", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                params: { field: "field" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const params = new Params("field")
                .NotEqualTo("field");

            // Act
            await params.Validate(req, res, next);

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
                params: { field: "field", otherField: "field" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const params = new Params("field", "/url")
                .EqualToField("otherField");

            // Act
            await params.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).not.toHaveBeenCalled();
        });

        test("GIVEN field is not equal to other field, EXPECT fail", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                params: { field: "field", otherField: "otherField" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const params = new Params("field", "/url")
                .EqualToField("otherField");

            // Act
            await params.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("field must be equal to field otherField");
        });

        test("GIVEN errorMessage is supplied, EXPECT message to be custom set", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                params: { field: "field", otherField: "otherField" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const params = new Params("field", "/url")
                .EqualToField("otherField")
                    .WithMessage("custom message");

            // Act
            await params.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("custom message");
        });

        test("GIVEN onFail is not supplied, EXPECT next to be called", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                params: { field: "field", otherField: "otherField" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const params = new Params("field")
                .EqualToField("otherField");

            // Act
            await params.Validate(req, res, next);

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
                params: { field: "field", otherField: "otherField" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const params = new Params("field", "/url")
                .NotEqualToField("otherField");

            // Act
            await params.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).not.toHaveBeenCalled();
        });

        test("GIVEN field is equal to other field, EXPECT pass", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                params: { field: "field", otherField: "field" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const params = new Params("field", "/url")
                .NotEqualToField("otherField");

            // Act
            await params.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("field must not be equal to field otherField");
        });

        test("GIVEN errorMessage is supplied, EXPECT message to be custom set", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                params: { field: "field", otherField: "field" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const params = new Params("field", "/url")
                .NotEqualToField("otherField")
                    .WithMessage("custom message");

            // Act
            await params.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("custom message");
        });

        test("GIVEN onFail is not supplied, EXPECT next to be called", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                params: { field: "field", otherField: "field" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const params = new Params("field")
                .NotEqualToField("otherField");

            // Act
            await params.Validate(req, res, next);

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
                params: { field: "field" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const params = new Params("field", "/url")
                .MaxLength(10);

            // Act
            await params.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).not.toHaveBeenCalled();
        });

        test("GIVEN field length is equal to max, EXPECT pass", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                params: { field: "fieldfield" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const params = new Params("field", "/url")
                .MaxLength(10);

            // Act
            await params.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).not.toHaveBeenCalled();
        });

        test("GIVEN field length is greater than max, EXPECT fail", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                params: { field: "fieldfieldfield" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const params = new Params("field", "/url")
                .MaxLength(10);

            // Act
            await params.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("field must be no more than 10 characters long");
        });

        test("GIVEN errorMessage is supplied, EXPECT message to be custom set", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                params: { field: "fieldfieldfield" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const params = new Params("field", "/url")
                .MaxLength(10)
                    .WithMessage("custom message");

            // Act
            await params.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("custom message");
        });

        test("GIVEN onFail is not supplied, EXPECT next to be called", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                params: { field: "fieldfieldfield" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const params = new Params("field")
                .MaxLength(10);

            // Act
            await params.Validate(req, res, next);

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
                params: { field: "fieldfieldfield" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const params = new Params("field", "/url")
                .MinLength(10);

            // Act
            await params.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).not.toHaveBeenCalled();
        });

        test("GIVEN field length is equal to min, EXPECT pass", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                params: { field: "fieldfield" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const params = new Params("field", "/url")
                .MinLength(10);

            // Act
            await params.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).not.toHaveBeenCalled();
        });

        test("GIVEN field length is less than min, EXPECT fail", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                params: { field: "field" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const params = new Params("field", "/url")
                .MinLength(10);

            // Act
            await params.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("field must be no less than 10 characters long");
        });

        test("GIVEN errorMessage is supplied, EXPECT message to be custom set", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                params: { field: "field" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const params = new Params("field", "/url")
                .MinLength(10)
                    .WithMessage("custom message");

            // Act
            await params.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("custom message");
        });

        test("GIVEN onFail is not supplied, EXPECT next to be called", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                params: { field: "field" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const params = new Params("field")
                .MinLength(10);

            // Act
            await params.Validate(req, res, next);

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
                params: { field: "1" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const params = new Params("field", "/url")
                .Number();

            // Act
            await params.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).not.toHaveBeenCalled();
        });

        test("GIVEN field is not a number, EXPECT fail", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                params: { field: "field" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const params = new Params("field", "/url")
                .Number();

            // Act
            await params.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("field must be a number");
        });

        test("GIVEN errorMessage is supplied, EXPECT message to be custom set", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                params: { field: "field" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const params = new Params("field", "/url")
                .Number()
                    .WithMessage("custom message");

            // Act
            await params.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("custom message");
        });

        test("GIVEN onFail is not supplied, EXPECT next to be called", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                params: { field: "field" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const params = new Params("field")
                .Number();

            // Act
            await params.Validate(req, res, next);

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
                params: { field: "test@mail.com" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const params = new Params("field", "/url")
                .EmailAddress();

            // Act
            await params.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).not.toHaveBeenCalled();
        });

        test("GIVEN field is not an email, EXPECT fail", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                params: { field: "field" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const params = new Params("field", "/url")
                .EmailAddress();

            // Act
            await params.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("field must be an email address");
        });

        test("GIVEN errorMessage is supplied, EXPECT message to be custom set", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                params: { field: "field" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const params = new Params("field", "/url")
                .EmailAddress()
                    .WithMessage("custom message");

            // Act
            await params.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("custom message");
        });

        test("GIVEN onFail is not supplied, EXPECT next to be called", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                params: { field: "field" },
            } as unknown as Request;
            const res = { redirect: jest.fn() } as unknown as Response;
            const next = jest.fn();
            const params = new Params("field")
                .EmailAddress();

            // Act
            await params.Validate(req, res, next);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalled();
            expect(next).toHaveBeenCalled();
        });
    });
});

describe('NotEmpty', () => {
    test('EXPECT rule to be pushed', () => {
        const params = new Params('field');

        params.NotEmpty();
        expect(params['rules']).toEqual([{ field: 'field', rule: ValidationRule.NotEmpty }]);
    });
});

describe('EqualTo', () => {
    test('EXPECT rule to be pushed', () => {
        const params = new Params('field');

        params.EqualTo('value');
        expect(params['rules']).toEqual([{ field: 'field', rule: ValidationRule.EqualTo, to: 'value' }]);
    });
});

describe('NotEqualTo', () => {
    test('EXPECT rule to be pushed', () => {
        const params = new Params('field');

        params.NotEqualTo('value');
        expect(params['rules']).toEqual([{ field: 'field', rule: ValidationRule.NotEqualTo, to: 'value' }]);
    });
});

describe('EqualToField', () => {
    test('EXPECT rule to be pushed', () => {
        const params = new Params('field');

        params.EqualToField('otherField');
        expect(params['rules']).toEqual([{ field: 'field', rule: ValidationRule.EqualToField, to: 'otherField' }]);
    });
});

describe('NotEqualToField', () => {
    test('EXPECT rule to be pushed', () => {
        const params = new Params('field');

        params.NotEqualToField('otherField');
        expect(params['rules']).toEqual([{ field: 'field', rule: ValidationRule.NotEqualToField, to: 'otherField' }]);
    });
});

describe('MaxLength', () => {
    test('EXPECT rule to be pushed', () => {
        const params = new Params('field');

        params.MaxLength(10);
        expect(params['rules']).toEqual([{ field: 'field', rule: ValidationRule.MaxLength, length: 10 }]);
    });
});

describe('MinLength', () => {
    test('EXPECT rule to be pushed', () => {
        const params = new Params('field');

        params.MinLength(5);
        expect(params['rules']).toEqual([{ field: 'field', rule: ValidationRule.MinLength, length: 5 }]);
    });
});

describe('Number', () => {
    test('EXPECT rule to be pushed', () => {
        const params = new Params('field');

        params.Number();
        expect(params['rules']).toEqual([{ field: 'field', rule: ValidationRule.Number }]);
    });
});

describe('EmailAddress', () => {
    test('EXPECT rule to be pushed', () => {
        const params = new Params('field');

        params.EmailAddress();
        expect(params['rules']).toEqual([{ field: 'field', rule: ValidationRule.EmailAddress }]);
    });
});

describe("WithMessage", () => {
    test("EXPECT message to be set", () => {
        const params = new Params("field")
            .NotEmpty()
                .WithMessage("custom message");

        expect(params['rules']).toEqual([{ field: 'field', rule: ValidationRule.NotEmpty, errorMessage: "custom message" }]);
    });

    test("GIVEN no rule, EXPECT nothing to happen", () => {
        const params = new Params("field")
            .WithMessage("custom message");

        expect(params['rules']).toEqual([]);
    });
});

describe("When", () => {
    test("EXPECT callback to be set", () => {
        const whenCallback = jest.fn();

        const params = new Params("field")
            .NotEmpty()
                .When(whenCallback);

        expect(params['rules']).toEqual([{ field: 'field', rule: ValidationRule.NotEmpty, whenCallback: whenCallback }]);
    });

    test("GIVEN no rule, EXPECT nothing to happen", () => {
        const whenCallback = jest.fn();

        const params = new Params("field")
            .When(whenCallback);

        expect(params['rules']).toEqual([]);
    });
});