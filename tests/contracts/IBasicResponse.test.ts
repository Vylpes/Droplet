import { GenerateResponse } from '../../src/contracts/IBasicResponse';

describe("GenerateResponse", () => {
    test("GIVEN both parameters are supplied, EXPECT response to be generated", () => {
        const response = GenerateResponse(true, "Test message");
        expect(response.IsSuccess).toBe(true);
        expect(response.Message).toBe("Test message");
    });

    test("GIVEN message parameter is undefined, EXPECT message returned to be undefined ", () => {
        const response = GenerateResponse(true, undefined);
        expect(response.IsSuccess).toBe(true);
        expect(response.Message).toBeUndefined();
    });

    test("GIVEN message parameter is not supplied, EXPECT message returned to be undefined", () => {
        const response = GenerateResponse(true);
        expect(response.IsSuccess).toBe(true);
        expect(response.Message).toBeUndefined();
    });

    test("GIVEN isSuccess parameter is not supplied, EXPECT isSuccess returned to be true", () => {
        const response = GenerateResponse();
        expect(response.IsSuccess).toBe(true);
        expect(response.Message).toBeUndefined();
    });
});