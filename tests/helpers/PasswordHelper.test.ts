import PasswordHelper from '../../src/helpers/PasswordHelper';
import bcryptjs from "bcryptjs";

describe("GenerateRandomHashedPassword", () => {
    test("EXPECT to return a hashed password", async () => {
        let randomString = "";

        bcryptjs.hash = jest.fn().mockImplementation((str: string, _: 10) => {
            randomString = str;

            return Promise.resolve("hashedPassword");
        });

        const hashedPassword = await PasswordHelper.GenerateRandomHashedPassword();

        expect(hashedPassword).toBe("hashedPassword");
        expect(bcryptjs.hash).toBeCalledTimes(1);
        expect(bcryptjs.hash).toBeCalledWith(expect.any(String), 10);
        expect(randomString).toBeDefined();
        expect(randomString.length).toBe(8);
    });
});

describe("GenerateRandomToken", () => {
    test("EXPECT to return a random token", async () => {
        const token = await PasswordHelper.GenerateRandomToken();

        expect(token).toBeDefined();
        expect(token.length).toBe(32);
    });
});