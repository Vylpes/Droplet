import { DataSource } from "typeorm";

describe("AppDataSource", () => {
    test("EXPECT options to be defined", () => {
        process.env.DB_HOST = "localhost";
        process.env.DB_PORT = "3306";
        process.env.DB_AUTH_USER = "user";
        process.env.DB_AUTH_PASS = "password";
        process.env.DB_NAME = "test";
        process.env.DB_SYNC = "false";
        process.env.DB_LOGGING = "false";

        DataSource.prototype.constructor = jest.fn().mockImplementation((options: any) => {
            expect(options.type).toBe("mysql");
            expect(options.host).toBe("localhost");
            expect(options.port).toBe(3306);
            expect(options.username).toBe("user");
            expect(options.password).toBe("password");
            expect(options.database).toBe("test");
            expect(options.synchronize).toBe(false);
            expect(options.logging).toBe(false);
            expect(options.entities).toEqual([
                "dist/database/entities/**/*.js",
            ]);
            expect(options.migrations).toEqual([
                "dist/database/migrations/**/*.js",
            ]);
            expect(options.subscribers).toEqual([
                "dist/database/subscribers/**/*.js",
            ]);

            return options;
        });
    });
});