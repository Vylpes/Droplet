import { Repository } from "typeorm";
import { Settings } from "../../../src/database/entities/Settings";
import AppDataSource from "../../../src/database/dataSources/appDataSource";

describe("constructor", () => {
    test("EXPECT properties to be set", () => {
        const key = "testKey";
        const value = "testValue";
        const settings = new Settings(key, value);

        expect(settings.Key).toBe(key);
        expect(settings.Value).toBe(value);
    });
});

describe("EditBasicDetails", () => {
    test("EXPECT properties to be updated", () => {
        const key = "testKey";
        const value = "testValue";
        const settings = new Settings(key, value);

        const newKey = "newKey";
        const newValue = "newValue";
        settings.EditBasicDetails(newKey, newValue);

        expect(settings.Key).toBe(newKey);
        expect(settings.Value).toBe(newValue);
    });
});

describe("FetchOneByKey", () => {
    test("GIVEN an entity is found, EXPECT it to be returned", async () => {
        const key = "testKey";
        const value = "testValue";
        const settings = new Settings(key, value);

        const repository = {
            findOne: jest.fn().mockResolvedValue(settings),
        } as unknown as Repository<Settings>;
        jest.spyOn(AppDataSource, 'getRepository').mockReturnValue(repository);

        const result = await Settings.FetchOneByKey(key);

        expect(repository.findOne).toHaveBeenCalledWith({ where: { Key: key }});
        expect(result).toBe(settings);
    });

    test("GIVEN an entity is not found, EXPECT null to be returned", async () => {
        const key = "testKey";
        const repository = {
            findOne: jest.fn().mockResolvedValue(null),
        } as unknown as Repository<Settings>;
        jest.spyOn(AppDataSource, 'getRepository').mockReturnValue(repository);

        const result = await Settings.FetchOneByKey(key);

        expect(repository.findOne).toHaveBeenCalledWith({ where: { Key: key }});
        expect(result).toBeNull();
    });
});