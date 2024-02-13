import { Request } from "express";
import { ValidationRule } from "../../constants/ValidationRule";
import IValidationRule from "../../contracts/IValidationRule";
import MessageHelper from "../MessageHelper";

export default class BodyValidator {
    private rules: IValidationRule[];

    private field: string;

    constructor(field: string) {
        this.rules = [];

        this.field = field;
    }

    public async Validate(req: Request): Promise<boolean> {
        const message = new MessageHelper(req);

        for (let i = 0; i < this.rules.length; i++) {
            const rule = this.rules[i];

            if (rule.whenCallback) {
                const shouldRun = rule.whenCallback(req);

                if (!shouldRun) {
                    continue;
                }
            }

            switch (rule.rule) {
                case ValidationRule.NotEmpty:
                    if (!req.body[rule.field] || req.body[rule.field].length == 0) {
                        await message.Error(rule.errorMessage || `${rule.field} is required`);

                        return false;
                    }
                    break;
                case ValidationRule.EqualTo:
                    if (req.body[rule.field] != rule.to) {
                        await message.Error(rule.errorMessage || `${rule.field} must be equal to ${rule.to}`);

                        return false;
                    }
                    break;
                case ValidationRule.NotEqualTo:
                    if (req.body[rule.field] == rule.to) {
                        await message.Error(rule.errorMessage || `${rule.field} must not be equal to ${rule.to}`);

                        return false;
                    }
                    break;
                case ValidationRule.EqualToField:
                    if (req.body[rule.field] != req.body[rule.to]) {
                        await message.Error(rule.errorMessage || `${rule.field} must be equal to field ${rule.to}`);

                        return false;
                    }
                    break;
                case ValidationRule.NotEqualToField:
                    if (req.body[rule.field] == req.body[rule.to]) {
                        await message.Error(rule.errorMessage || `${rule.field} must not be equal to field ${rule.to}`);

                        return false;
                    }
                    break;
                case ValidationRule.MaxLength:
                    if (req.body[rule.field].length > rule.length) {
                        await message.Error(rule.errorMessage || `${rule.field} must be no more than ${rule.length} characters long`);

                        return false;
                    }
                    break;
                case ValidationRule.MinLength:
                    if (req.body[rule.field].length < rule.length) {
                        await message.Error(rule.errorMessage || `${rule.field} must be no less than ${rule.length} characters long`);

                        return false;
                    }
                    break;
                case ValidationRule.Number:
                    console.log(typeof Number(0));
                    if (typeof Number(req.body[rule.field]) != "number") {
                        await message.Error(rule.errorMessage || `${rule.field} must be a number`);

                        return false;
                    }
                    break;
                case ValidationRule.EmailAddress:
                    if (!String(req.body[rule.field]).match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
                        await message.Error(rule.errorMessage || `${rule.field} must be an email address`);

                        return false;
                    }
                    break;
                case ValidationRule.Boolean:
                    if (req.body[rule.field] != "true" && req.body[rule.field] != "false") {
                        await message.Error(rule.errorMessage || `${rule.field} must be a boolean`);

                        return false;
                    }
                    break;
                case ValidationRule.GreaterThan:
                    if (Number(req.body[rule.field]) <= rule.length) {
                        await message.Error(rule.errorMessage || `${rule.field} must be greater than ${rule.length}`);

                        return false;
                    }
                    break;
                case ValidationRule.LessThan:
                    if (Number(req.body[rule.field]) >= rule.length) {
                        await message.Error(rule.errorMessage || `${rule.field} must be less than ${rule.length}`);

                        return false;
                    }
                    break;
                default:
            }
        }

        return true;
    }

    public NotEmpty(): BodyValidator {
        this.rules.push({
            field: this.field,
            rule: ValidationRule.NotEmpty,
        });

        return this;
    }

    public EqualTo(value: string): BodyValidator {
        this.rules.push({
            field: this.field,
            rule: ValidationRule.EqualTo,
            to: value,
        });

        return this;
    }

    public NotEqualTo(value: string): BodyValidator {
        this.rules.push({
            field: this.field,
            rule: ValidationRule.NotEqualTo,
            to: value,
        });

        return this;
    }

    public EqualToField(field: string): BodyValidator {
        this.rules.push({
            field: this.field,
            rule: ValidationRule.EqualToField,
            to: field,
        });

        return this;
    }

    public NotEqualToField(field: string): BodyValidator {
        this.rules.push({
            field: this.field,
            rule: ValidationRule.NotEqualToField,
            to: field,
        });

        return this;
    }

    public MaxLength(length: number): BodyValidator {
        this.rules.push({
            field: this.field,
            rule: ValidationRule.MaxLength,
            length: length,
        });

        return this;
    }


    public MinLength(length: number): BodyValidator {
        this.rules.push({
            field: this.field,
            rule: ValidationRule.MinLength,
            length: length,
        });

        return this;
    }

    public Number(): BodyValidator {
        this.rules.push({
            field: this.field,
            rule: ValidationRule.Number,
        });

        return this;
    }

    public EmailAddress(): BodyValidator {
        this.rules.push({
            field: this.field,
            rule: ValidationRule.EmailAddress,
        });

        return this;
    }

    public Boolean(): BodyValidator {
        this.rules.push({
            field: this.field,
            rule: ValidationRule.Boolean,
        });

        return this;
    }

    public GreaterThan(num: number): BodyValidator {
        this.rules.push({
            field: this.field,
            rule: ValidationRule.GreaterThan,
            length: num,
        });

        return this;
    }

    public LessThan(num: number): BodyValidator {
        this.rules.push({
            field: this.field,
            rule: ValidationRule.LessThan,
            length: num,
        });

        return this;
    }

    public WithMessage(message: string): BodyValidator {
        const rulesLength = this.rules.length;

        if (rulesLength == 0) return this;

        this.rules[rulesLength - 1].errorMessage = message;

        return this;
    }

    public When(whenCallback: Function): BodyValidator {
        const rulesLength = this.rules.length;

        if (rulesLength == 0) return this;

        this.rules[rulesLength - 1].whenCallback = whenCallback;

        return this;
    }

    public ChangeField(field: string): BodyValidator {
        this.field = field;

        return this;
    }
}
