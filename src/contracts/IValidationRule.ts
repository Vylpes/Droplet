import { ValidationRule } from "../constants/ValidationRule";

export default interface IValidationRule {
    field: string,
    rule: ValidationRule,
    to?: string,
    length?: number,
    errorMessage?: string,
    whenCallback?: Function,
}