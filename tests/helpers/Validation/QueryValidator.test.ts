import QueryValidator from '../../../src/helpers/Validation/QueryValidator';
import { Request, Response } from 'express';
import MessageHelper from '../../../src/helpers/MessageHelper';
import { ValidationRule } from '../../../src/constants/ValidationRule';

describe('constructor', () => {
    test('EXPECT properties to be set', () => {
        const queryValidator = new QueryValidator("fieldName");

        expect(queryValidator['field']).toBe('fieldName');
        expect(queryValidator['rules']).toEqual([]);
    });
});

describe("Validate", () => {
    test("GIVEN whenCallback is supplied, EXPECT whenCallback to be execute", async () => {
        // Arrange
        MessageHelper.prototype.Error = jest.fn();

        const req = {
            query: { field: "field" },
        } as unknown as Request;
        const whenCallback = jest.fn().mockReturnValue(true);
        const queryValidator = new QueryValidator("field")
            .NotEmpty()
                .When(whenCallback);

        // Act
        await queryValidator.Validate(req);

        // Assert
        expect(whenCallback).toHaveBeenCalledWith(req);
    });

    test("GIVEN whenCallback is not supplied, EXPECT validation to be executed", async () => {
        // Arrange
        MessageHelper.prototype.Error = jest.fn();

        const req = {
            query: { field: "" },
        } as unknown as Request;
        const whenCallback = jest.fn().mockReturnValue(true);
        const queryValidator = new QueryValidator("field")
            .NotEmpty();

        // Act
        await queryValidator.Validate(req);

        // Assert
        expect(whenCallback).not.toHaveBeenCalled();
        expect(MessageHelper.prototype.Error).toHaveBeenCalled(); // Validation is setup to fail so we know it has been executed if this is called
    });

    test("GIVEN whenCallback returns false, EXPECT validation to be skipped", async () => {
        // Arrange
        MessageHelper.prototype.Error = jest.fn();

        const req = {
            query: { field: "" },
            flash: jest.fn(),
        } as unknown as Request;
        const whenCallback = jest.fn().mockReturnValue(false);
        const queryValidator = new QueryValidator("field")
            .NotEmpty()
                .When(whenCallback);

        // Act
        await queryValidator.Validate(req);

        // Assert
        expect(whenCallback).toHaveBeenCalledWith(req);
        expect(MessageHelper.prototype.Error).not.toHaveBeenCalled(); // Validation is setup to fail so we know it has been executed if this is called
    });

    test("GIVEN whenCallback returns true, EXPECT validation to be executed", async () => {
        // Arrange
        MessageHelper.prototype.Error = jest.fn();

        const req = {
            query: { field: "" },
            flash: jest.fn(),
        } as unknown as Request;
        const whenCallback = jest.fn().mockReturnValue(true);
        const queryValidator = new QueryValidator("field")
            .NotEmpty()
                .When(whenCallback);

        // Act
        await queryValidator.Validate(req);

        // Assert
        expect(whenCallback).toHaveBeenCalledWith(req);
        expect(MessageHelper.prototype.Error).toHaveBeenCalled(); // Validation is setup to fail so we know it has been executed if this is called
    });

    describe("NotEmpty", () => {
        test("GIVEN field is not empty, EXPECT pass", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                query: { field: "field" },
            } as unknown as Request;
            const queryValidator = new QueryValidator("field")
                .NotEmpty();

            // Act
            const result = await queryValidator.Validate(req);

            // Assert
            expect(MessageHelper.prototype.Error).not.toHaveBeenCalled();
            expect(result).toBe(true);
        });

        test("GIVEN field is null, EXPECT fail", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                query: { field: null },
            } as unknown as Request;
            const queryValidator = new QueryValidator("field")
                .NotEmpty();

            // Act
            const result = await queryValidator.Validate(req);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("field is required");
            expect(result).toBe(false);
        });

        test("GIVEN field length is 0, EXPECT fail", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                query: { field: "" },
            } as unknown as Request;
            const queryValidator = new QueryValidator("field")
                .NotEmpty();

            // Act
            const result = await queryValidator.Validate(req);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("field is required");
            expect(result).toBe(false);
        });

        test("GIVEN errorMessage is supplied, EXPECT message to be custom set", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                query: { field: "" },
            } as unknown as Request;
            const queryValidator = new QueryValidator("field")
                .NotEmpty()
                    .WithMessage("custom message");

            // Act
            await queryValidator.Validate(req);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("custom message");
        });
    });

    describe("EqualTo", () => {
        test("GIVEN field is equal to string, EXPECT pass", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                query: { field: "field" },
            } as unknown as Request;
            const queryValidator = new QueryValidator("field")
                .EqualTo("field");

            // Act
            const result = await queryValidator.Validate(req);

            // Assert
            expect(MessageHelper.prototype.Error).not.toHaveBeenCalled();
            expect(result).toBe(true);
        });

        test("GIVEN field is not equal to string, EXEPCT fail", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                query: { field: "field" },
            } as unknown as Request;
            const queryValidator = new QueryValidator("field")
                .EqualTo("otherField");

            // Act
            const result = await queryValidator.Validate(req);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("field must be equal to otherField");
            expect(result).toBe(false);
        });

        test("GIVEN errorMessage is supplied, EXPECT message to be custom set", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                query: { field: "field" },
            } as unknown as Request;
            const queryValidator = new QueryValidator("field")
                .EqualTo("otherField")
                    .WithMessage("custom message");

            // Act
            await queryValidator.Validate(req);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("custom message");
        });
    });

    describe("NotEqualTo", () => {
        test("GIVEN field is not equal to string, EXPECT pass", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                query: { field: "field" },
            } as unknown as Request;
            const queryValidator = new QueryValidator("field")
                .NotEqualTo("otherField");

            // Act
            const result = await queryValidator.Validate(req);

            // Assert
            expect(MessageHelper.prototype.Error).not.toHaveBeenCalled();
            expect(result).toBe(true);
        });

        test("GIVEN field is equal to string, EXPECT fail", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                query: { field: "field" },
            } as unknown as Request;
            const queryValidator = new QueryValidator("field")
                .NotEqualTo("field");

            // Act
            const result = await queryValidator.Validate(req);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("field must not be equal to field");
            expect(result).toBe(false);
        });

        test("GIVEN errorMessage is supplied, EXPECT message to be custom set", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                query: { field: "field" },
            } as unknown as Request;
            const queryValidator = new QueryValidator("field")
                .NotEqualTo("field")
                    .WithMessage("custom message");

            // Act
            await queryValidator.Validate(req);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("custom message");
        });
    });

    describe("EqualToField", () => {
        test("GIVEN field is equal to other field, EXPECT pass", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                query: { field: "field", otherField: "field" },
            } as unknown as Request;
            const queryValidator = new QueryValidator("field")
                .EqualToField("otherField");

            // Act
            const result = await queryValidator.Validate(req);

            // Assert
            expect(MessageHelper.prototype.Error).not.toHaveBeenCalled();
            expect(result).toBe(true);
        });

        test("GIVEN field is not equal to other field, EXPECT fail", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                query: { field: "field", otherField: "otherField" },
            } as unknown as Request;
            const queryValidator = new QueryValidator("field")
                .EqualToField("otherField");

            // Act
            const result = await queryValidator.Validate(req);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("field must be equal to field otherField");
            expect(result).toBe(false);
        });

        test("GIVEN errorMessage is supplied, EXPECT message to be custom set", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                query: { field: "field", otherField: "otherField" },
            } as unknown as Request;
            const queryValidator = new QueryValidator("field")
                .EqualToField("otherField")
                    .WithMessage("custom message");

            // Act
            await queryValidator.Validate(req);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("custom message");
        });
    });

    describe("NotEqualToField", () => {
        test("GIVEN field is not equal to other field, EXPECT pass", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                query: { field: "field", otherField: "otherField" },
            } as unknown as Request;
            const queryValidator = new QueryValidator("field")
                .NotEqualToField("otherField");

            // Act
            const result = await queryValidator.Validate(req);

            // Assert
            expect(MessageHelper.prototype.Error).not.toHaveBeenCalled();
            expect(result).toBe(true);
        });

        test("GIVEN field is equal to other field, EXPECT fail", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                query: { field: "field", otherField: "field" },
            } as unknown as Request;
            const queryValidator = new QueryValidator("field")
                .NotEqualToField("otherField");

            // Act
            const result = await queryValidator.Validate(req);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("field must not be equal to field otherField");
            expect(result).toBe(false);
        });

        test("GIVEN errorMessage is supplied, EXPECT message to be custom set", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                query: { field: "field", otherField: "field" },
            } as unknown as Request;
            const queryValidator = new QueryValidator("field")
                .NotEqualToField("otherField")
                    .WithMessage("custom message");

            // Act
            await queryValidator.Validate(req);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("custom message");
        });
    });

    describe("Number", () => {
        test("GIVEN field is a number, EXPECT pass", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                query: { field: "1" },
            } as unknown as Request;
            const queryValidator = new QueryValidator("field")
                .Number();

            // Act
            const result = await queryValidator.Validate(req);

            // Assert
            expect(MessageHelper.prototype.Error).not.toHaveBeenCalled();
            expect(result).toBe(true);
        });

        test("GIVEN field is not a number, EXPECT fail", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                query: { field: "field" },
            } as unknown as Request;
            const queryValidator = new QueryValidator("field")
                .Number();

            // Act
            const result = await queryValidator.Validate(req);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("field must be a number");
            expect(result).toBe(false);
        });

        test("GIVEN errorMessage is supplied, EXPECT message to be custom set", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                query: { field: "field" },
            } as unknown as Request;
            const queryValidator = new QueryValidator("field")
                .Number()
                    .WithMessage("custom message");

            // Act
            await queryValidator.Validate(req);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("custom message");
        });
    });

    describe("EmailAddress", () => {
        test("GIVEN field is an email, EXPECT pass", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                query: { field: "test@mail.com" },
            } as unknown as Request;
            const queryValidator = new QueryValidator("field")
                .EmailAddress();

            // Act
            const result = await queryValidator.Validate(req);

            // Assert
            expect(MessageHelper.prototype.Error).not.toHaveBeenCalled();
            expect(result).toBe(true);
        });

        test("GIVEN field is not an email, EXPECT fail", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                query: { field: "field" },
            } as unknown as Request;
            const queryValidator = new QueryValidator("field")
                .EmailAddress();

            // Act
            const result = await queryValidator.Validate(req);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("field must be an email address");
            expect(result).toBe(false);
        });

        test("GIVEN errorMessage is supplied, EXPECT message to be custom set", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                query: { field: "field" },
            } as unknown as Request;
            const queryValidator = new QueryValidator("field")
                .EmailAddress()
                    .WithMessage("custom message");

            // Act
            await queryValidator.Validate(req);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("custom message");
        });
    });

    describe("Boolean", () => {
        test("GIVEN field is true, EXPECT pass", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                query: { field: "true" },
            } as unknown as Request;
            const queryValidator = new QueryValidator("field")
                .Boolean();

            // Act
            const result = await queryValidator.Validate(req);

            // Assert
            expect(MessageHelper.prototype.Error).not.toHaveBeenCalled();
            expect(result).toBe(true);
        });

        test("GIVEN field is false, EXPECT pass", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                query: { field: "false" },
            } as unknown as Request;
            const queryValidator = new QueryValidator("field")
                .Boolean();

            // Act
            const result = await queryValidator.Validate(req);

            // Assert
            expect(MessageHelper.prototype.Error).not.toHaveBeenCalled();
            expect(result).toBe(true);
        });

        test("GIVEN field is not a boolean, EXPECT fail", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                query: { field: "field" },
            } as unknown as Request;
            const queryValidator = new QueryValidator("field")
                .Boolean();

            // Act
            const result = await queryValidator.Validate(req);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("field must be a boolean");
            expect(result).toBe(false);
        });

        test("GIVEN errorMessage is supplied, EXPECT message to be custom set", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                query: { field: "field" },
            } as unknown as Request;
            const queryValidator = new QueryValidator("field")
                .Boolean()
                    .WithMessage("custom message");

            // Act
            await queryValidator.Validate(req);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("custom message");
        });
    });

    describe("GreaterThan", () => {
        test("GIVEN field is greater than value, EXPECT pass", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                query: { field: "6" },
            } as unknown as Request;
            const queryValidator = new QueryValidator("field")
                .GreaterThan(5);

            // Act
            const result = await queryValidator.Validate(req);

            // Assert
            expect(MessageHelper.prototype.Error).not.toHaveBeenCalled();
            expect(result).toBe(true);
        });

        test("GIVEN field is equal to value, EXPECT fail", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                query: { field: "5" },
            } as unknown as Request;
            const queryValidator = new QueryValidator("field")
                .GreaterThan(5);

            // Act
            const result = await queryValidator.Validate(req);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("field must be greater than 5");
            expect(result).toBe(false);
        });

        test("GIVEN field is less than value, EXPECT fail", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                query: { field: "4" },
            } as unknown as Request;
            const queryValidator = new QueryValidator("field")
                .GreaterThan(5);

            // Act
            const result = await queryValidator.Validate(req);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("field must be greater than 5");
            expect(result).toBe(false);
        });

        test("GIVEN field is not a number, EXPECT fail", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                query: { field: "field" },
            } as unknown as Request;
            const queryValidator = new QueryValidator("field")
                .GreaterThan(5);

            // Act
            const result = await queryValidator.Validate(req);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("field must be greater than 5");
            expect(result).toBe(false);
        });

        test("GIVEN errorMessage is supplied, EXPECT message to be custom set", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                query: { field: "4" },
            } as unknown as Request;
            const queryValidator = new QueryValidator("field")
                .GreaterThan(5)
                    .WithMessage("custom message");

            // Act
            await queryValidator.Validate(req);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("custom message");
        });
    });

    describe("LessThan", () => {
        test("GIVEN field is less than value, EXPECT pass", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                query: { field: "4" },
            } as unknown as Request;
            const queryValidator = new QueryValidator("field")
                .LessThan(5);

            // Act
            const result = await queryValidator.Validate(req);

            // Assert
            expect(MessageHelper.prototype.Error).not.toHaveBeenCalled();
            expect(result).toBe(true);
        });

        test("GIVEN field is equal to value, EXPECT fail", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                query: { field: "5" },
            } as unknown as Request;
            const queryValidator = new QueryValidator("field")
                .LessThan(5);

            // Act
            const result = await queryValidator.Validate(req);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("field must be less than 5");
            expect(result).toBe(false);
        });

        test("GIVEN field is greater than value, EXPECT fail", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                query: { field: "6" },
            } as unknown as Request;
            const queryValidator = new QueryValidator("field")
                .LessThan(5);

            // Act
            const result = await queryValidator.Validate(req);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("field must be less than 5");
            expect(result).toBe(false);
        });

        test("GIVEN field is not a number, EXPECT fail", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                query: { field: "field" },
            } as unknown as Request;
            const queryValidator = new QueryValidator("field")
                .LessThan(5);

            // Act
            const result = await queryValidator.Validate(req);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("field must be less than 5");
            expect(result).toBe(false);
        });

        test("GIVEN errorMessage is supplied, EXPECT message to be custom set", async () => {
            // Arrange
            MessageHelper.prototype.Error = jest.fn();

            const req = {
                query: { field: "6" },
            } as unknown as Request;
            const queryValidator = new QueryValidator("field")
                .LessThan(5)
                    .WithMessage("custom message");

            // Act
            await queryValidator.Validate(req);

            // Assert
            expect(MessageHelper.prototype.Error).toHaveBeenCalledWith("custom message");
        });
    });
});

describe('NotEmpty', () => {
    test('EXPECT rule to be pushed', () => {
        const queryValidator = new QueryValidator('field');

        queryValidator.NotEmpty();
        expect(queryValidator['rules']).toEqual([{ field: 'field', rule: ValidationRule.NotEmpty }]);
    });
});

describe('EqualTo', () => {
    test('EXPECT rule to be pushed', () => {
        const queryValidator = new QueryValidator('field');

        queryValidator.EqualTo('value');
        expect(queryValidator['rules']).toEqual([{ field: 'field', rule: ValidationRule.EqualTo, to: 'value' }]);
    });
});

describe('NotEqualTo', () => {
    test('EXPECT rule to be pushed', () => {
        const queryValidator = new QueryValidator('field');

        queryValidator.NotEqualTo('value');
        expect(queryValidator['rules']).toEqual([{ field: 'field', rule: ValidationRule.NotEqualTo, to: 'value' }]);
    });
});

describe('EqualToField', () => {
    test('EXPECT rule to be pushed', () => {
        const queryValidator = new QueryValidator('field');

        queryValidator.EqualToField('otherField');
        expect(queryValidator['rules']).toEqual([{ field: 'field', rule: ValidationRule.EqualToField, to: 'otherField' }]);
    });
});

describe('NotEqualToField', () => {
    test('EXPECT rule to be pushed', () => {
        const queryValidator = new QueryValidator('field');

        queryValidator.NotEqualToField('otherField');
        expect(queryValidator['rules']).toEqual([{ field: 'field', rule: ValidationRule.NotEqualToField, to: 'otherField' }]);
    });
});

describe('Number', () => {
    test('EXPECT rule to be pushed', () => {
        const queryValidator = new QueryValidator('field');

        queryValidator.Number();
        expect(queryValidator['rules']).toEqual([{ field: 'field', rule: ValidationRule.Number }]);
    });
});

describe('EmailAddress', () => {
    test('EXPECT rule to be pushed', () => {
        const queryValidator = new QueryValidator('field');

        queryValidator.EmailAddress();
        expect(queryValidator['rules']).toEqual([{ field: 'field', rule: ValidationRule.EmailAddress }]);
    });
});

describe('Boolean', () => {
    test('EXPECT rule to be pushed', () => {
        const queryValidator = new QueryValidator('field');

        queryValidator.Boolean();
        expect(queryValidator['rules']).toEqual([{ field: 'field', rule: ValidationRule.Boolean }]);
    });
});

describe('GreaterThan', () => {
    test('EXPECT rule to be pushed', () => {
        const queryValidator = new QueryValidator('field');

        queryValidator.GreaterThan(5);
        expect(queryValidator['rules']).toEqual([{ field: 'field', rule: ValidationRule.GreaterThan, length: 5 }]);
    });
});

describe('LessThan', () => {
    test('EXPECT rule to be pushed', () => {
        const queryValidator = new QueryValidator('field');

        queryValidator.LessThan(10);
        expect(queryValidator['rules']).toEqual([{ field: 'field', rule: ValidationRule.LessThan, length: 10 }]);
    });
});

describe("WithMessage", () => {
    test("EXPECT message to be set", () => {
        const queryValidator = new QueryValidator("field")
            .NotEmpty()
                .WithMessage("custom message");

        expect(queryValidator['rules']).toEqual([{ field: 'field', rule: ValidationRule.NotEmpty, errorMessage: "custom message" }]);
    });

    test("GIVEN no rule, EXPECT nothing to happen", () => {
        const queryValidator = new QueryValidator("field")
            .WithMessage("custom message");

        expect(queryValidator['rules']).toEqual([]);
    });
});

describe("When", () => {
    test("EXPECT callback to be set", () => {
        const whenCallback = jest.fn();

        const queryValidator = new QueryValidator("field")
            .NotEmpty()
                .When(whenCallback);

        expect(queryValidator['rules']).toEqual([{ field: 'field', rule: ValidationRule.NotEmpty, whenCallback: whenCallback }]);
    });

    test("GIVEN no rule, EXPECT nothing to happen", () => {
        const whenCallback = jest.fn();

        const queryValidator = new QueryValidator("field")
            .When(whenCallback);

        expect(queryValidator['rules']).toEqual([]);
    });
});