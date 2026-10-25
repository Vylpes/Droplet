import { Request } from "express";
import ApiBodyValidator from "../../../src/helpers/Validation/ApiBodyValidator";
import { GenerateValidationResponse } from "../../../src/contracts/IBasicResponse";

function createMockRequest(body: Record<string, unknown> = {}): Request {
    return { body } as unknown as Request;
}

describe("ApiBodyValidator", () => {
    describe("Validate", () => {
        it("returns null when required fields are present", () => {
            const req = createMockRequest({
                email: "user@example.com",
                password: "secret"
            });

            const validator = new ApiBodyValidator("email")
                .NotEmpty()
                .EmailAddress()
                .ChangeField("password")
                .NotEmpty();

            expect(validator.Validate(req)).toBeNull();
        });

        it("returns field and message when a required field is missing", () => {
            const req = createMockRequest({ password: "secret" });

            const validator = new ApiBodyValidator("email")
                .NotEmpty()
                .ChangeField("password")
                .NotEmpty();

            expect(validator.Validate(req)).toEqual({
                field: "email",
                message: "email is required"
            });
        });

        it("returns the failing field for later rules in the chain", () => {
            const req = createMockRequest({ email: "user@example.com" });

            const validator = new ApiBodyValidator("email")
                .NotEmpty()
                .ChangeField("password")
                .NotEmpty();

            expect(validator.Validate(req)).toEqual({
                field: "password",
                message: "password is required"
            });
        });

        it("uses WithMessage for custom error text while keeping the field", () => {
            const req = createMockRequest({});

            const validator = new ApiBodyValidator("email")
                .NotEmpty()
                .WithMessage("Please enter your email");

            expect(validator.Validate(req)).toEqual({
                field: "email",
                message: "Please enter your email"
            });
        });

        it("skips a rule when its When callback returns false", () => {
            const req = createMockRequest({});

            const validator = new ApiBodyValidator("name")
                .NotEmpty()
                .When(() => false);

            expect(validator.Validate(req)).toBeNull();
        });

        it("treats numeric 0 as present for NotEmpty + Number fields", () => {
            const req = createMockRequest({
                unlisted: 0,
                listed: 0,
                sold: 0,
                rejected: 0
            });

            const validator = new ApiBodyValidator("unlisted")
                .NotEmpty()
                .Number()
                .GreaterThan(-1)
                .ChangeField("listed")
                .NotEmpty()
                .Number()
                .GreaterThan(-1)
                .ChangeField("sold")
                .NotEmpty()
                .Number()
                .GreaterThan(-1)
                .ChangeField("rejected")
                .NotEmpty()
                .Number()
                .GreaterThan(-1);

            expect(validator.Validate(req)).toBeNull();
        });

        it("rejects negative quantities", () => {
            const req = createMockRequest({ unlisted: -1 });

            const validator = new ApiBodyValidator("unlisted")
                .NotEmpty()
                .Number()
                .GreaterThan(-1)
                .WithMessage("unlisted must be 0 or greater");

            expect(validator.Validate(req)).toEqual({
                field: "unlisted",
                message: "unlisted must be 0 or greater"
            });
        });

        it("still rejects missing number fields", () => {
            const req = createMockRequest({ listed: 1 });

            const validator = new ApiBodyValidator("unlisted")
                .NotEmpty()
                .Number();

            expect(validator.Validate(req)).toEqual({
                field: "unlisted",
                message: "unlisted is required"
            });
        });
    });
});

describe("GenerateValidationResponse", () => {
    it("maps a validation failure to Message and Errors", () => {
        expect(
            GenerateValidationResponse({
                field: "email",
                message: "email is required"
            })
        ).toEqual({
            IsSuccess: false,
            Message: "email is required",
            Errors: { email: "email is required" }
        });
    });
});
