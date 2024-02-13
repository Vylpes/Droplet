import { Repository } from 'typeorm';
import { UserTokenType } from '../../../src/constants/UserTokenType';
import UserToken from '../../../src/database/entities/UserToken';
import AppDataSource from '../../../src/database/dataSources/appDataSource';
import { User } from '../../../src/database/entities/User';

describe("constructor", () => {
    test("EXPECT properties to be set", () => {
        // Arrange
        const token = "testToken";
        const expires = new Date();
        const type = UserTokenType.PasswordReset;

        // Act
        const userToken = new UserToken(token, expires, type);

        // Assert
        expect(userToken.Token).toBe(token);
        expect(userToken.Expires).toBe(expires);
        expect(userToken.Type).toBe(type);
    });
});

describe("CheckIfExpired", () => {
    test("GIVEN token is valid, EXPECT false to be returned", async () => {
        // Arrange
        const token = "testToken";
        const expires = new Date(Date.now() + 1000); // Expires in the future
        const type = UserTokenType.PasswordReset;
        const userToken = new UserToken(token, expires, type);

        // Act
        const result = await userToken.CheckIfExpired();

        // Assert
        expect(result).toBe(false);
    });

    test("GIVEN token is expired, EXPECT true to be returned and token to be removed", async () => {
        // Arrange
        const token = "testToken";
        const expires = new Date(Date.now() - 1000); // Expires in the past
        const type = UserTokenType.PasswordReset;
        const userToken = new UserToken(token, expires, type);
        const repository = {
            remove: jest.fn(),
        } as unknown as Repository<UserToken>;
        jest.spyOn(AppDataSource, "getRepository").mockReturnValue(repository);

        // Act
        const result = await userToken.CheckIfExpired();

        // Assert
        expect(result).toBe(true);
        expect(repository.remove).toHaveBeenCalledWith(userToken);
    });
});

describe("FetchOneByToken", () => {
    test("EXPECT entity to be returned", async () => {
        // Arrange
        const token = new UserToken("token", new Date(), UserTokenType.PasswordReset);
        const relations = ["relation1", "relation2"];
        const repository = {
            findOne: jest.fn().mockResolvedValue(token),
        } as unknown as Repository<UserToken>;
        jest.spyOn(AppDataSource, "getRepository").mockReturnValue(repository);

        // Act
        const result = await UserToken.FetchOneByToken("token", relations);

        // Assert
        expect(result).toBe(token);
        expect(repository.findOne).toHaveBeenCalledWith({ where: { Token: "token" }, relations: relations });
    });

    test("GIVEN relations parameter is undefined, EXPECT flat entity to be returned", async () => {
        // Arrange
        const token = "token";
        const repository = {
            findOne: jest.fn().mockResolvedValue(token),
        } as unknown as Repository<UserToken>;
        jest.spyOn(AppDataSource, "getRepository").mockReturnValue(repository);

        // Act
        const result = await UserToken.FetchOneByToken(token, undefined);

        // Assert
        expect(result).toBeDefined();
        expect(repository.findOne).toHaveBeenCalledWith({ where: { Token: "token" }, relations: [] });
    });

    test("GIVEN relations parameter is not supplied, EXPECT flat entity to be returned", async () => {
        // Arrange
        const token = "token";
        const repository = {
            findOne: jest.fn().mockResolvedValue(token),
        } as unknown as Repository<UserToken>;
        jest.spyOn(AppDataSource, "getRepository").mockReturnValue(repository);

        // Act
        const result = await UserToken.FetchOneByToken(token);

        // Assert
        expect(result).toBeDefined();
        expect(repository.findOne).toHaveBeenCalledWith({ where: { Token: "token" }, relations: [] });
    });
});

describe("InvalidateAllTokensForUser", () => {
    test("EXPECT all tokens for user to be removed", async () => {
        // Arrange
        const userId = "testUserId";
        const user = new User("testUser", "testEmail", "testPassword", true, true, true);
        const userToken1 = new UserToken("token1", new Date(), UserTokenType.PasswordReset);
        const userToken2 = new UserToken("token2", new Date(), UserTokenType.PasswordReset);
        user.Tokens = [userToken1, userToken2];
        const repository = {
            findOne: jest.fn().mockResolvedValue(user),
            remove: jest.fn(),
            save: jest.fn(),
        } as unknown as Repository<User>;
        jest.spyOn(AppDataSource, "getRepository").mockReturnValue(repository);

        // Act
        await UserToken.InvalidateAllTokensForUser(userId);

        // Assert
        expect(repository.findOne).toHaveBeenCalledWith({ where: { Id: userId }, relations: ["Tokens"] });
        expect(repository.remove).toHaveBeenCalledWith(userToken1);
        expect(repository.remove).toHaveBeenCalledWith(userToken2);
        expect(repository.remove).toHaveBeenCalledTimes(2);
        expect(repository.save).toHaveBeenCalledWith(user);
    });

    test("GIVEN user is not found, EXPECT nothing to happen", async () => {
        // Arrange
        const userId = "nonExistentUserId";
        const repository = {
            findOne: jest.fn().mockResolvedValue(undefined),
            remove: jest.fn(),
            save: jest.fn(),
        } as unknown as Repository<User>;
        jest.spyOn(AppDataSource, "getRepository").mockReturnValue(repository);

        // Act
        await UserToken.InvalidateAllTokensForUser(userId);

        // Assert
        expect(repository.findOne).toHaveBeenCalledWith({ where: { Id: userId }, relations: ["Tokens"] });
        expect(repository.remove).not.toHaveBeenCalled();
        expect(repository.save).not.toHaveBeenCalled();
    });
});