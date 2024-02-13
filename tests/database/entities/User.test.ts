import { Repository } from "typeorm";
import { UserTokenType } from "../../../src/constants/UserTokenType";
import { User } from "../../../src/database/entities/User";
import UserToken from "../../../src/database/entities/UserToken";
import AppDataSource from "../../../src/database/dataSources/appDataSource";
import { hash } from "bcryptjs";

describe("constructor", () => {
    test("EXPECT properties to be set", () => {
        // Arrange
        const email = "test@example.com";
        const username = "testuser";
        const password = "password";
        const verified = true;
        const admin = false;
        const active = true;

        // Act
        const user = new User(email, username, password, verified, admin, active);

        // Assert
        expect(user.Email).toBe(email);
        expect(user.Username).toBe(username);
        expect(user.Password).toBe(password);
        expect(user.Verified).toBe(verified);
        expect(user.Admin).toBe(admin);
        expect(user.Active).toBe(active);
    });
});

describe("UpdateBasicDetails", () => {
    test("EXPECT properties to be updated", () => {
        // Arrange
        const user = new User("test@example.com", "testuser", "password", true, false, true);
        const email = "updated@example.com";
        const username = "updateduser";
        const admin = true;
        const active = false;

        // Act
        user.UpdateBasicDetails(email, username, admin, active);

        // Assert
        expect(user.Email).toBe(email);
        expect(user.Username).toBe(username);
        expect(user.Admin).toBe(admin);
        expect(user.Active).toBe(active);
    });
});

describe("UpdatePassword", () => {
    test("EXPECT password to be updated", () => {
        // Arrange
        const user = new User("test@example.com", "testuser", "password", true, false, true);
        const newPassword = "newpassword";

        // Act
        user.UpdatePassword(newPassword);

        // Assert
        expect(user.Password).toBe(newPassword);
    });
});

describe("AddTokenToUser", () => {
    test("EXPECT entity to be pushed", () => {
        // Arrange
        const user = new User("test@example.com", "testuser", "password", true, false, true);
        user.Tokens = [];
        const token = new UserToken("token", new Date(), UserTokenType.PasswordReset);

        // Act
        user.AddTokenToUser(token);

        // Assert
        expect(user.Tokens).toContain(token);
    });
});

describe("Verify", () => {
    test("EXPECT property to be set to true", () => {
        // Arrange
        const user = new User("test@example.com", "testuser", "password", false, false, true);

        // Act
        user.Verify();

        // Assert
        expect(user.Verified).toBe(true);
    });
});

describe("ToggleActive", () => {
    test("GIVEN user is active, EXPECT active to be set to false", () => {
        // Arrange
        const user = new User("test@example.com", "testuser", "password", true, false, true);

        // Act
        user.ToggleActive();

        // Assert
        expect(user.Active).toBe(false);
    });

    test("GIVEN user is not active, EXPECT active to be set to true", () => {
        // Arrange
        const user = new User("test@example.com", "testuser", "password", true, false, false);

        // Act
        user.ToggleActive();

        // Assert
        expect(user.Active).toBe(true);
    });
});

describe("IsLoginCorrect", () => {
    test("GIVEN email and password match, EXPECT true to be returned", async () => {
        // Arrange
        const email = "test@example.com";
        const password = "password";
        const user = new User(email, "testuser", await hash(password, 10), true, false, true);
        const repository = {
            findOne: jest.fn().mockReturnValue(user),
        } as unknown as Repository<User>;
        jest.spyOn(AppDataSource, "getRepository").mockReturnValue(repository);

        // Act
        const result = await User.IsLoginCorrect(email, password);

        // Assert
        expect(result).toBe(true);
        expect(repository.findOne).toBeCalledWith({ where: { Email: email } });
    });

    test("GIVEN user is not found, EXPECT false to be returned", async () => {
        // Arrange
        const email = "test@example.com";
        const password = "password";
        const repository = {
            findOne: jest.fn().mockReturnValue(undefined),
        } as unknown as Repository<User>;
        jest.spyOn(AppDataSource, "getRepository").mockReturnValue(repository);

        // Act
        const result = await User.IsLoginCorrect(email, password);

        // Assert
        expect(result).toBe(false);
    });

    test("GIVEN passwords do not match, EXPECT false to be returned", async () => {
        // Arrange
        const email = "test@example.com";
        const password = "password";
        const user = new User(email, "testuser", "differentpassword", true, false, true);
        const repository = {
            findOne: jest.fn().mockReturnValue(user),
        } as unknown as Repository<User>;
        jest.spyOn(AppDataSource, "getRepository").mockReturnValue(repository);

        // Act
        const result = await User.IsLoginCorrect(email, password);

        // Assert
        expect(result).toBe(false);
    });
});

describe("FetchOneByUsername", () => {
    test("EXPECT user to be returned", async () => {
        // Arrange
        const username = "testuser";
        const user = new User("test@example.com", username, "password", true, false, true);
        const repository = {
            findOne: jest.fn().mockReturnValue(user),
        } as unknown as Repository<User>;
        jest.spyOn(AppDataSource, "getRepository").mockReturnValue(repository);

        // Act
        const result = await User.FetchOneByUsername(username, [ "relation" ]);

        // Assert
        expect(result).toBe(user);
        expect(repository.findOne).toBeCalledWith({ where: { Username: username }, relations: [ "relation" ] });
    });

    test("GIVEN relations parameter is undefined, EXPECT flat entity to be returned", async () => {
        // Arrange
        const username = "testuser";
        const user = new User("test@example.com", username, "password", true, false, true);
        const repository = {
            findOne: jest.fn().mockReturnValue(user),
        } as unknown as Repository<User>;
        jest.spyOn(AppDataSource, "getRepository").mockReturnValue(repository);

        // Act
        const result = await User.FetchOneByUsername(username, undefined);

        // Assert
        expect(result).toBe(user);
    });

    test("GIVEN relations parameter is not set, EXPECT flat entity to be returned", async () => {
        // Arrange
        const username = "testuser";
        const user = new User("test@example.com", username, "password", true, false, true);
        const repository = {
            findOne: jest.fn().mockReturnValue(user),
        } as unknown as Repository<User>;
        jest.spyOn(AppDataSource, "getRepository").mockReturnValue(repository);

        // Act
        const result = await User.FetchOneByUsername(username);

        // Assert
        expect(result).toBe(user);
        expect(repository.findOne).toBeCalledWith({ where: { Username: username }, relations: [] });
    });

    test("GIVEN user is not found, EXPECT undefined to be returned", async () => {
        // Arrange
        const username = "testuser";
        const repository = {
            findOne: jest.fn().mockReturnValue(undefined),
        } as unknown as Repository<User>;
        jest.spyOn(AppDataSource, "getRepository").mockReturnValue(repository);

        // Act
        const result = await User.FetchOneByUsername(username);

        // Assert
        expect(result).toBeUndefined();
        expect(repository.findOne).toBeCalledWith({ where: { Username: username }, relations: [] });
    });
});

describe("FetchOneByEmail", () => {
    test("EXPECT user to be returned", async () => {
        // Arrange
        const email = "test@example.com";
        const user = new User(email, "testuser", "password", true, false, true);
        const repository = {
            findOne: jest.fn().mockReturnValue(user),
        } as unknown as Repository<User>;
        jest.spyOn(AppDataSource, "getRepository").mockReturnValue(repository);

        // Act
        const result = await User.FetchOneByEmail(email, [ "relation" ]);

        // Assert
        expect(result).toBe(user);
        expect(repository.findOne).toBeCalledWith({ where: { Email: email }, relations: [ "relation" ] });
    });

    test("GIVEN relations parameter is undefined, EXPECT flat entity to be returned", async () => {
        // Arrange
        const email = "test@example.com";
        const user = new User(email, "testuser", "password", true, false, true);
        const repository = {
            findOne: jest.fn().mockReturnValue(user),
        } as unknown as Repository<User>;
        jest.spyOn(AppDataSource, "getRepository").mockReturnValue(repository);

        // Act
        const result = await User.FetchOneByEmail(email, undefined);

        // Assert
        expect(result).toBe(user);
        expect(repository.findOne).toBeCalledWith({ where: { Email: email }, relations: [] });
    });

    test("GIVEN relations parameter is not set, EXPECT flat entity to be returned", async () => {
        // Arrange
        const email = "test@example.com";
        const user = new User(email, "testuser", "password", true, false, true);
        const repository = {
            findOne: jest.fn().mockReturnValue(user),
        } as unknown as Repository<User>;
        jest.spyOn(AppDataSource, "getRepository").mockReturnValue(repository);

        // Act
        const result = await User.FetchOneByEmail(email);

        // Assert
        expect(result).toBe(user);
        expect(repository.findOne).toBeCalledWith({ where: { Email: email }, relations: [] });
    });

    test("GIVEN user is not found, EXPECT undefined to be returned", async () => {
        // Arrange
        const email = "test@example.com";
        const repository = {
            findOne: jest.fn().mockReturnValue(undefined),
        } as unknown as Repository<User>;
        jest.spyOn(AppDataSource, "getRepository").mockReturnValue(repository);

        // Act
        const result = await User.FetchOneByEmail(email);

        // Assert
        expect(result).toBeUndefined();
        expect(repository.findOne).toBeCalledWith({ where: { Email: email }, relations: [] });
    });
});