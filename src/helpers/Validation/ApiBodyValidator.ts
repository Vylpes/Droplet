import { Request } from "express";
import { ValidationRule } from "../../constants/ValidationRule";
import IValidationRule from "../../contracts/IValidationRule";

/**
 * JSON-capable body validator. Returns an error message string on failure,
 * or null on success — does not write flash messages.
 */
export default class ApiBodyValidator {
    private rules: IValidationRule[];
    private field: string;

    constructor(field: string) {
        this.rules = [];
        this.field = field;
    }

    public Validate(req: Request): string | null {
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
                        return rule.errorMessage || `${rule.field} is required`;
                    }
                    break;
                case ValidationRule.EqualTo:
                    if (req.body[rule.field] != rule.to) {
                        return rule.errorMessage || `${rule.field} must be equal to ${rule.to}`;
                    }
                    break;
                case ValidationRule.NotEqualTo:
                    if (req.body[rule.field] == rule.to) {
                        return rule.errorMessage || `${rule.field} must not be equal to ${rule.to}`;
                    }
                    break;
                case ValidationRule.EqualToField:
                    if (req.body[rule.field] != req.body[rule.to!]) {
                        return rule.errorMessage || `${rule.field} must be equal to field ${rule.to}`;
                    }
                    break;
                case ValidationRule.NotEqualToField:
                    if (req.body[rule.field] == req.body[rule.to!]) {
                        return rule.errorMessage || `${rule.field} must not be equal to field ${rule.to}`;
                    }
                    break;
                case ValidationRule.MaxLength:
                    if (req.body[rule.field].length > rule.length!) {
                        return rule.errorMessage || `${rule.field} must be no more than ${rule.length} characters long`;
                    }
                    break;
                case ValidationRule.MinLength:
                    if (req.body[rule.field].length < rule.length!) {
                        return rule.errorMessage || `${rule.field} must be no less than ${rule.length} characters long`;
                    }
                    break;
                case ValidationRule.Number:
                    if (typeof Number(req.body[rule.field]) != "number" || isNaN(Number(req.body[rule.field]))) {
                        return rule.errorMessage || `${rule.field} must be a number`;
                    }
                    break;
                case ValidationRule.EmailAddress:
                    if (!String(req.body[rule.field]).match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
                        return rule.errorMessage || `${rule.field} must be an email address`;
                    }
                    break;
                case ValidationRule.Boolean:
                    if (req.body[rule.field] != "true" && req.body[rule.field] != "false"
                        && req.body[rule.field] !== true && req.body[rule.field] !== false) {
                        return rule.errorMessage || `${rule.field} must be a boolean`;
                    }
                    break;
                case ValidationRule.GreaterThan:
                    if (Number(req.body[rule.field]) <= rule.length!) {
                        return rule.errorMessage || `${rule.field} must be greater than ${rule.length}`;
                    }
                    break;
                case ValidationRule.LessThan:
                    if (Number(req.body[rule.field]) >= rule.length!) {
                        return rule.errorMessage || `${rule.field} must be less than ${rule.length}`;
                    }
                    break;
            }
        }

        return null;
    }

    public ChangeField(field: string): ApiBodyValidator {
        this.field = field;
        return this;
    }

    public NotEmpty(): ApiBodyValidator {
        this.rules.push({ field: this.field, rule: ValidationRule.NotEmpty });
        return this;
    }

    public EqualTo(to: string): ApiBodyValidator {
        this.rules.push({ field: this.field, rule: ValidationRule.EqualTo, to });
        return this;
    }

    public NotEqualTo(to: string): ApiBodyValidator {
        this.rules.push({ field: this.field, rule: ValidationRule.NotEqualTo, to });
        return this;
    }

    public EqualToField(to: string): ApiBodyValidator {
        this.rules.push({ field: this.field, rule: ValidationRule.EqualToField, to });
        return this;
    }

    public NotEqualToField(to: string): ApiBodyValidator {
        this.rules.push({ field: this.field, rule: ValidationRule.NotEqualToField, to });
        return this;
    }

    public MaxLength(length: number): ApiBodyValidator {
        this.rules.push({ field: this.field, rule: ValidationRule.MaxLength, length });
        return this;
    }

    public MinLength(length: number): ApiBodyValidator {
        this.rules.push({ field: this.field, rule: ValidationRule.MinLength, length });
        return this;
    }

    public Number(): ApiBodyValidator {
        this.rules.push({ field: this.field, rule: ValidationRule.Number });
        return this;
    }

    public Boolean(): ApiBodyValidator {
        this.rules.push({ field: this.field, rule: ValidationRule.Boolean });
        return this;
    }

    public EmailAddress(): ApiBodyValidator {
        this.rules.push({ field: this.field, rule: ValidationRule.EmailAddress });
        return this;
    }

    public GreaterThan(num: number): ApiBodyValidator {
        this.rules.push({ field: this.field, rule: ValidationRule.GreaterThan, length: num });
        return this;
    }

    public LessThan(num: number): ApiBodyValidator {
        this.rules.push({ field: this.field, rule: ValidationRule.LessThan, length: num });
        return this;
    }

    public WithMessage(errorMessage: string): ApiBodyValidator {
        if (this.rules.length > 0) {
            this.rules[this.rules.length - 1].errorMessage = errorMessage;
        }
        return this;
    }

    public When(whenCallback: Function): ApiBodyValidator {
        if (this.rules.length > 0) {
            this.rules[this.rules.length - 1].whenCallback = whenCallback;
        }
        return this;
    }
}
