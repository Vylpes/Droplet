import { NextFunction, Request, Response } from "express";
import { ValidationRule } from "../../constants/ValidationRule";
import IValidationRule from "../../contracts/IValidationRule";
import MessageHelper from "../MessageHelper";

export default class Query {
    private rules: IValidationRule[];

    private onFail?: string;
    private field: string;

    constructor(field: string, onFail?: string) {
        this.rules = [];

        this.field = field;
        this.onFail = onFail;
    }

    public async Validate(req: Request, res: Response, next: NextFunction) {
        const message = new MessageHelper(req);

        for (let i = 0; i < this.rules.length; i++) {
            const rule = this.rules[i];

            if (rule.whenCallback) {
                const shouldRun = rule.whenCallback(req);

                if (!shouldRun) {
                    next();
                    return;
                }
            }

            switch (rule.rule) {
                case ValidationRule.NotEmpty:
                    if (!req.query[rule.field] || req.query[rule.field].length == 0) {
                        await message.Error(rule.errorMessage || `${rule.field} is required`);

                        if (!this.onFail) {
                            next();
                            return;
                        }

                        res.redirect(this.onFail);
                        return;
                    }
                    break;
                case ValidationRule.EqualTo:
                    if (req.query[rule.field] != rule.to) {
                        await message.Error(rule.errorMessage || `${rule.field} must be equal to ${rule.to}`);

                        if (!this.onFail) {
                            next();
                            return;
                        }

                        res.redirect(this.onFail);
                        return;
                    }
                    break;
                case ValidationRule.NotEqualTo:
                    if (req.query[rule.field] == rule.to) {
                        await message.Error(rule.errorMessage || `${rule.field} must not be equal to ${rule.to}`);

                        if (!this.onFail) {
                            next();
                            return;
                        }

                        res.redirect(this.onFail);
                        return;
                    }
                    break;
                case ValidationRule.EqualToField:
                    if (req.query[rule.field] != req.query[rule.to]) {
                        await message.Error(rule.errorMessage || `${rule.field} must be equal to field ${rule.to}`);

                        if (!this.onFail) {
                            next();
                            return;
                        }

                        res.redirect(this.onFail);
                        return;
                    }
                    break;
                case ValidationRule.NotEqualToField:
                    if (req.query[rule.field] == req.query[rule.to]) {
                        await message.Error(rule.errorMessage || `${rule.field} must not be equal to field ${rule.to}`);

                        if (!this.onFail) {
                            next();
                            return;
                        }

                        res.redirect(this.onFail);
                        return;
                    }
                    break;
                case ValidationRule.MaxLength:
                    if (req.query[rule.field].toString().length > rule.length) {
                        await message.Error(rule.errorMessage || `${rule.field} must be no more than ${rule.length} characters long`);

                        if (!this.onFail) {
                            next();
                            return;
                        }

                        res.redirect(this.onFail);
                        return;
                    }
                    break;
                case ValidationRule.MinLength:
                    if (req.query[rule.field].toString().length < rule.length) {
                        await message.Error(rule.errorMessage || `${rule.field} must be no less than ${rule.length} characters long`);

                        if (!this.onFail) {
                            next();
                            return;
                        }

                        res.redirect(this.onFail);
                        return;
                    }
                    break;
                case ValidationRule.Number:
                    if (!Number(req.query[rule.field])) {
                        await message.Error(rule.errorMessage || `${rule.field} must be a number`);

                        if (!this.onFail) {
                            next();
                            return;
                        }

                        res.redirect(this.onFail);
                        return;
                    }
                    break;
                case ValidationRule.EmailAddress:
                    if (!String(req.query[rule.field]).match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
                        await message.Error(rule.errorMessage || `${rule.field} must be an email address`);

                        if (!this.onFail) {
                            next();
                            return;
                        }

                        res.redirect(this.onFail);
                        return;
                    }
                    break;
                default:
            }
        }

        next();
    }

    public NotEmpty(): Query {
        this.rules.push({
            field: this.field,
            rule: ValidationRule.NotEmpty,
        });

        return this;
    }

    public EqualTo(value: string): Query {
        this.rules.push({
            field: this.field,
            rule: ValidationRule.EqualTo,
            to: value,
        });

        return this;
    }

    public NotEqualTo(value: string): Query {
        this.rules.push({
            field: this.field,
            rule: ValidationRule.NotEqualTo,
            to: value,
        });

        return this;
    }

    public EqualToField(field: string): Query {
        this.rules.push({
            field: this.field,
            rule: ValidationRule.EqualToField,
            to: field,
        });

        return this;
    }

    public NotEqualToField(field: string): Query {
        this.rules.push({
            field: this.field,
            rule: ValidationRule.NotEqualToField,
            to: field,
        });

        return this;
    }

    public MaxLength(length: number): Query {
        this.rules.push({
            field: this.field,
            rule: ValidationRule.MaxLength,
            length: length,
        });

        return this;
    }


    public MinLength(length: number): Query {
        this.rules.push({
            field: this.field,
            rule: ValidationRule.MinLength,
            length: length,
        });

        return this;
    }

    public Number(): Query {
        this.rules.push({
            field: this.field,
            rule: ValidationRule.Number,
        });

        return this;
    }

    public EmailAddress(): Query {
        this.rules.push({
            field: this.field,
            rule: ValidationRule.EmailAddress,
        });

        return this;
    }

    public WithMessage(message: string): Query {
        const rulesLength = this.rules.length;

        if (rulesLength == 0) return this;

        this.rules[rulesLength - 1].errorMessage = message;

        return this;
    }

    public When(whenCallback: Function): Query {
        const rulesLength = this.rules.length;

        if (rulesLength == 0) return this;

        this.rules[rulesLength - 1].whenCallback = whenCallback;

        return this;
    }

    public ChangeField(field: string): Query {
        this.field = field;

        return this;
    }
}
