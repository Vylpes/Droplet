import { Request } from "express";
import { ValidationRule } from "../../constants/ValidationRule";
import IValidationRule from "../../contracts/IValidationRule";
import MessageHelper from "../MessageHelper";

export default class QueryValidator {
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
                    if (!req.query[rule.field] || req.query[rule.field].length == 0) {
                        await message.Error(rule.errorMessage || `${rule.field} is required`);

                        return false;
                    }
                    break;
                case ValidationRule.EqualTo:
                    if (req.query[rule.field] != rule.to) {
                        await message.Error(rule.errorMessage || `${rule.field} must be equal to ${rule.to}`);

                        return false;
                    }
                    break;
                case ValidationRule.NotEqualTo:
                    if (req.query[rule.field] == rule.to) {
                        await message.Error(rule.errorMessage || `${rule.field} must not be equal to ${rule.to}`);

                        return false;
                    }
                    break;
                case ValidationRule.EqualToField:
                    if (req.query[rule.field] != req.query[rule.to]) {
                        await message.Error(rule.errorMessage || `${rule.field} must be equal to field ${rule.to}`);

                        return false;
                    }
                    break;
                case ValidationRule.NotEqualToField:
                    if (req.query[rule.field] == req.query[rule.to]) {
                        await message.Error(rule.errorMessage || `${rule.field} must not be equal to field ${rule.to}`);

                        return false;
                    }
                    break;
                case ValidationRule.Number:
                    if (!Number(req.query[rule.field])) {
                        await message.Error(rule.errorMessage || `${rule.field} must be a number`);

                        return false;
                    }
                    break;
                case ValidationRule.EmailAddress:
                    if (!String(req.query[rule.field]).match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
                        await message.Error(rule.errorMessage || `${rule.field} must be an email address`);

                        return false;
                    }
                    break;
                case ValidationRule.Boolean:
                    if (req.query[rule.field] != "true" && req.query[rule.field] != "false") {
                        await message.Error(rule.errorMessage || `${rule.field} must be a boolean`);

                        return false;
                    }
                    break;
                case ValidationRule.GreaterThan:
                    if (!Number(req.query[rule.field]) || Number(req.query[rule.field]) <= rule.length) {
                        await message.Error(rule.errorMessage || `${rule.field} must be greater than ${rule.length}`);

                        return false;
                    }
                    break;
                case ValidationRule.LessThan:
                    if (!Number(req.query[rule.field]) || Number(req.query[rule.field]) >= rule.length) {
                        await message.Error(rule.errorMessage || `${rule.field} must be less than ${rule.length}`);

                        return false;
                    }
                    break;
                default:
            }
        }

        return true;
    }

    public NotEmpty(): QueryValidator {
        this.rules.push({
            field: this.field,
            rule: ValidationRule.NotEmpty,
        });

        return this;
    }

    public EqualTo(value: string): QueryValidator {
        this.rules.push({
            field: this.field,
            rule: ValidationRule.EqualTo,
            to: value,
        });

        return this;
    }

    public NotEqualTo(value: string): QueryValidator {
        this.rules.push({
            field: this.field,
            rule: ValidationRule.NotEqualTo,
            to: value,
        });

        return this;
    }

    public EqualToField(field: string): QueryValidator {
        this.rules.push({
            field: this.field,
            rule: ValidationRule.EqualToField,
            to: field,
        });

        return this;
    }

    public NotEqualToField(field: string): QueryValidator {
        this.rules.push({
            field: this.field,
            rule: ValidationRule.NotEqualToField,
            to: field,
        });

        return this;
    }

    public Number(): QueryValidator {
        this.rules.push({
            field: this.field,
            rule: ValidationRule.Number,
        });

        return this;
    }

    public EmailAddress(): QueryValidator {
        this.rules.push({
            field: this.field,
            rule: ValidationRule.EmailAddress,
        });

        return this;
    }

    public Boolean(): QueryValidator {
        this.rules.push({
            field: this.field,
            rule: ValidationRule.Boolean,
        });

        return this;
    }

    public GreaterThan(num: number): QueryValidator {
        this.rules.push({
            field: this.field,
            rule: ValidationRule.GreaterThan,
            length: num,
        });

        return this;
    }

    public LessThan(num: number): QueryValidator {
        this.rules.push({
            field: this.field,
            rule: ValidationRule.LessThan,
            length: num,
        });

        return this;
    }

    public WithMessage(message: string): QueryValidator {
        const rulesLength = this.rules.length;

        if (rulesLength == 0) return this;

        this.rules[rulesLength - 1].errorMessage = message;

        return this;
    }

    public When(whenCallback: Function): QueryValidator {
        const rulesLength = this.rules.length;

        if (rulesLength == 0) return this;

        this.rules[rulesLength - 1].whenCallback = whenCallback;

        return this;
    }

    public ChangeField(field: string): QueryValidator {
        this.field = field;

        return this;
    }
}
