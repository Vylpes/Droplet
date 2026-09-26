import { Request } from "express";
import BodyValidator from "../../../src/helpers/Validation/BodyValidator";

function createMockRequest(body: Record<string, unknown> = {}): Request {
    return {
        body,
        flash: jest.fn(),
        session: {
            save: (callback: (err?: string) => void) => callback(),
        },
    } as unknown as Request;
}

describe("BodyValidator", () => {
    describe("Validate", () => {
        it("returns true when required fields are present on the request body", async () => {
            const req = createMockRequest({
                description: "Widget purchase",
                price: "12.50",
            });

            const validator = new BodyValidator("description")
                .NotEmpty()
                .ChangeField("price")
                .NotEmpty()
                .Number();

            await expect(validator.Validate(req)).resolves.toBe(true);
            expect(req.flash).not.toHaveBeenCalled();
        });

        it("returns false and flashes an error when a required field is missing", async () => {
            const req = createMockRequest({ price: "12.50" });

            const validator = new BodyValidator("description")
                .NotEmpty()
                .ChangeField("price")
                .NotEmpty();

            await expect(validator.Validate(req)).resolves.toBe(false);
            expect(req.flash).toHaveBeenCalledWith("error", "description is required");
        });

        it("returns false when a required field is an empty string", async () => {
            const req = createMockRequest({ description: "", price: "12.50" });

            const validator = new BodyValidator("description").NotEmpty();

            await expect(validator.Validate(req)).resolves.toBe(false);
            expect(req.flash).toHaveBeenCalledWith("error", "description is required");
        });

        it("throws when called with req.body instead of the request (regression for #337)", async () => {
            const req = createMockRequest({
                description: "Widget purchase",
                price: "12.50",
            });

            const validator = new BodyValidator("description").NotEmpty();

            // Passing the body object makes Validate look for body.body.description
            await expect(validator.Validate(req.body as Request)).rejects.toThrow(
                /Cannot read properties of undefined \(reading 'description'\)/,
            );
        });

        it("passes the full request to When callbacks", async () => {
            const req = createMockRequest({ type: "building", name: "Warehouse" });
            const whenCallback = jest.fn().mockReturnValue(true);

            const validator = new BodyValidator("name")
                .NotEmpty()
                .When(whenCallback);

            await expect(validator.Validate(req)).resolves.toBe(true);
            expect(whenCallback).toHaveBeenCalledWith(req);
        });

        it("skips a rule when its When callback returns false", async () => {
            const req = createMockRequest({});

            const validator = new BodyValidator("name")
                .NotEmpty()
                .When(() => false);

            await expect(validator.Validate(req)).resolves.toBe(true);
            expect(req.flash).not.toHaveBeenCalled();
        });

        it("validates EqualTo against a literal value", async () => {
            const req = createMockRequest({ status: "ordered" });

            const matching = new BodyValidator("status").EqualTo("ordered");
            const mismatching = new BodyValidator("status").EqualTo("received");

            await expect(matching.Validate(req)).resolves.toBe(true);
            await expect(mismatching.Validate(req)).resolves.toBe(false);
            expect(req.flash).toHaveBeenCalledWith(
                "error",
                "status must be equal to received",
            );
        });

        it("validates EqualToField against another body field", async () => {
            const matchingReq = createMockRequest({
                password: "secret",
                passwordRepeat: "secret",
            });
            const mismatchingReq = createMockRequest({
                password: "secret",
                passwordRepeat: "different",
            });

            const validator = new BodyValidator("password").EqualToField("passwordRepeat");

            await expect(validator.Validate(matchingReq)).resolves.toBe(true);
            await expect(validator.Validate(mismatchingReq)).resolves.toBe(false);
        });

        it("uses a custom error message from WithMessage", async () => {
            const req = createMockRequest({});

            const validator = new BodyValidator("email")
                .NotEmpty()
                .WithMessage("Please enter your email");

            await expect(validator.Validate(req)).resolves.toBe(false);
            expect(req.flash).toHaveBeenCalledWith("error", "Please enter your email");
        });
    });
});
