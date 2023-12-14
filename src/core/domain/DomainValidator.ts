import DomainCommand from "./DomainCommand";

enum DomainValidationRuleType {
    NotEmpty,
    EqualTo,
    NotEqualTo,
    EqualToField,
    NotEqualToField,
    MaxLength,
    MinLength,
    EmailAddress,
    GreaterThan,
    LessThan,
}

interface DomainValidationRule<TCommand extends DomainCommand> {
    field: keyof TCommand,
    rule: DomainValidationRuleType,
    to?: string,
    toField?: keyof TCommand,
    length?: number,
}

export default class DomainValidator<TCommand extends DomainCommand> {
    private rules: DomainValidationRule<TCommand>[] = [];

    public Validate(command: TCommand): boolean {
        for (let rule of this.rules) {
            switch (rule.rule) {
                case DomainValidationRuleType.NotEmpty:
                    if (!command[rule.field] || String(command[rule.field]).length == 0) {
                        return false;
                    }
                    break;
                case DomainValidationRuleType.EqualTo:
                    if (command[rule.field] != rule.to) {
                        return false;
                    }
                    break;
                case DomainValidationRuleType.NotEqualTo:
                    if (command[rule.field] == rule.to) {
                        return false;
                    }
                    break;
                case DomainValidationRuleType.EqualToField:
                    if (command[rule.field] != command[rule.toField]) {
                        return false;
                    }
                    break;
                case DomainValidationRuleType.NotEqualToField:
                    if (command[rule.field] == command[rule.toField]) {
                        return false;
                    }
                    break;
                case DomainValidationRuleType.MaxLength:
                    if (String(command[rule.field]).length > rule.length) {
                        return false;
                    }
                    break;
                case DomainValidationRuleType.MinLength:
                    if (String(command[rule.field]).length < rule.length) {
                        return false;
                    }
                    break;
                case DomainValidationRuleType.EmailAddress:
                    if (!String(command[rule.field]).match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
                        return false
                    }
                    break;
                default:
            }
        }
    }

    public NotEmpty(field: keyof TCommand): DomainValidator<TCommand> {
        this.rules.push({
            field: field,
            rule: DomainValidationRuleType.NotEmpty,
        });

        return this;
    }

    public EqualTo(field: keyof TCommand, value: string): DomainValidator<TCommand> {
        this.rules.push({
            field: field,
            rule: DomainValidationRuleType.EqualTo,
            to: value,
        });

        return this;
    }

    public NotEqualTo(field: keyof TCommand, value: string): DomainValidator<TCommand> {
        this.rules.push({
            field: field,
            rule: DomainValidationRuleType.NotEqualTo,
            to: value,
        });

        return this;
    }

    public EqualToField(field: keyof TCommand, value: keyof TCommand): DomainValidator<TCommand> {
        this.rules.push({
            field: field,
            rule: DomainValidationRuleType.EqualToField,
            toField: value,
        });

        return this;
    }

    public NotEqualToField(field: keyof TCommand, value: keyof TCommand): DomainValidator<TCommand> {
        this.rules.push({
            field: field,
            rule: DomainValidationRuleType.NotEqualToField,
            toField: value,
        });

        return this;
    }

    public MaxLength(field: keyof TCommand, value: number): DomainValidator<TCommand> {
        this.rules.push({
            field: field,
            rule: DomainValidationRuleType.MaxLength,
            length: value,
        });

        return this;
    }

    public MinLength(field: keyof TCommand, value: number): DomainValidator<TCommand> {
        this.rules.push({
            field: field,
            rule: DomainValidationRuleType.MinLength,
            length: value,
        });

        return this;
    }

    public EmailAddress(field: keyof TCommand): DomainValidator<TCommand> {
        this.rules.push({
            field: field,
            rule: DomainValidationRuleType.EmailAddress,
        });

        return this;
    }
}