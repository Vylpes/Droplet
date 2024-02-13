import { DefaultSettings } from '../../src/constants/DefaultSettings';

describe('DefaultSettings', () => {
    test("GIVEN input is return.count, EXPECT 1 to be returned", () => {
        expect(DefaultSettings["return.count"]).toBe("1");
    });
});