import { NextFunction, Request, Response } from "express";
import { ValidationRule } from "../../constants/ValidationRule";
import IValidationRule from "../../contracts/IValidationRule";
import MessageHelper from "../MessageHelper";

export default class Body {
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

            switch (rule.rule) {
                case ValidationRule.NotEmpty:
                    if (!req.body[rule.field] || req.body[rule.field].length == 0) {
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
                    if (req.body[rule.field] != rule.to) {
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
                    if (req.body[rule.field] == rule.to) {
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
                    if (req.body[rule.field] != req.body[rule.to]) {
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
                    if (req.body[rule.field] == req.body[rule.to]) {
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
                    if (req.body[rule.field].length > rule.length) {
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
                    if (req.body[rule.field].length < rule.length) {
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
                    console.log(typeof Number(0));
                    if (typeof Number(req.body[rule.field]) != "number") {
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
                    if (!String(req.body[rule.field]).match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
                        await message.Error(rule.errorMessage || `${rule.field} must be an email address`);

                        if (!this.onFail) {
                            next();
                            return;
                        }

                        res.redirect(this.onFail);
                        return;
                    }
                    break;
                case ValidationRule.Boolean:
                    if (req.body[rule.field] != "true" && req.body[rule.field] != "false") {
                        await message.Error(rule.errorMessage || `${rule.field} must be a boolean`);

                        if (!this.onFail) {
                            next();
                            return;
                        }

                        res.redirect(this.onFail);
                        return;
                    }
                    break;
                case ValidationRule.GreaterThan:
                    if (Number(req.body[rule.field]) <= rule.length) {
                        await message.Error(rule.errorMessage || `${rule.field} must be greater than ${rule.length}`);

                        if (!this.onFail) {
                            next();
                            return;
                        }

                        res.redirect(this.onFail);
                        return;
                    }
                    break;
                case ValidationRule.LessThan:
                    if (Number(req.body[rule.field]) >= rule.length) {
                        await message.Error(rule.errorMessage || `${rule.field} must be less than ${rule.length}`);

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

    public NotEmpty(): Body {
        this.rules.push({
            field: this.field,
            rule: ValidationRule.NotEmpty,
        });

        return this;
    }

    public EqualTo(value: string): Body {
        this.rules.push({
            field: this.field,
            rule: ValidationRule.EqualTo,
            to: value,
        });

        return this;
    }

    public NotEqualTo(value: string): Body {
        this.rules.push({
            field: this.field,
            rule: ValidationRule.NotEqualTo,
            to: value,
        });

        return this;
    }

    public EqualToField(field: string): Body {
        this.rules.push({
            field: this.field,
            rule: ValidationRule.EqualToField,
            to: field,
        });

        return this;
    }

    public NotEqualToField(field: string): Body {
        this.rules.push({
            field: this.field,
            rule: ValidationRule.NotEqualToField,
            to: field,
        });

        return this;
    }

    public MaxLength(length: number): Body {
        this.rules.push({
            field: this.field,
            rule: ValidationRule.MaxLength,
            length: length,
        });

        return this;
    }


    public MinLength(length: number): Body {
        this.rules.push({
            field: this.field,
            rule: ValidationRule.MinLength,
            length: length,
        });

        return this;
    }

    public Number(): Body {
        this.rules.push({
            field: this.field,
            rule: ValidationRule.Number,
        });

        return this;
    }

    public EmailAddress(): Body {
        this.rules.push({
            field: this.field,
            rule: ValidationRule.EmailAddress,
        });

        return this;
    }

    public Boolean(): Body {
        this.rules.push({
            field: this.field,
            rule: ValidationRule.Boolean,
        });

        return this;
    }

    public GreaterThan(num: number): Body {
        this.rules.push({
            field: this.field,
            rule: ValidationRule.GreaterThan,
            length: num,
        });

        return this;
    }

    public LessThan(num: number): Body {
        this.rules.push({
            field: this.field,
            rule: ValidationRule.LessThan,
            length: num,
        });

        return this;
    }

    public WithMessage(message: string): Body {
        const rulesLength = this.rules.length;

        if (rulesLength == 0) return this;

        this.rules[rulesLength - 1].errorMessage = message;

        return this;
    }

    public ChangeField(field: string): Body {
        this.field = field;

        return this;
    }
}
