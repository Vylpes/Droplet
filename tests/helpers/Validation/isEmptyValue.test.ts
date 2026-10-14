import { isEmptyValue } from "../../../src/helpers/Validation/isEmptyValue";

describe("isEmptyValue", () => {
    it("treats undefined, null, and empty string/array as empty", () => {
        expect(isEmptyValue(undefined)).toBe(true);
        expect(isEmptyValue(null)).toBe(true);
        expect(isEmptyValue("")).toBe(true);
        expect(isEmptyValue([])).toBe(true);
    });

    it("treats 0 and false as present", () => {
        expect(isEmptyValue(0)).toBe(false);
        expect(isEmptyValue(false)).toBe(false);
    });

    it("treats non-empty strings and numbers as present", () => {
        expect(isEmptyValue("0")).toBe(false);
        expect(isEmptyValue(1)).toBe(false);
        expect(isEmptyValue("text")).toBe(false);
    });
});
