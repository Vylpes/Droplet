import BaseEntity from "../../src/contracts/BaseEntity";
import AppDataSource from "../../src/database/dataSources/appDataSource";

describe('constructor', () => {
    test("EXPECT properties to be set", () => {
        const entity = new BaseEntity();

        expect(entity.Id).toBeDefined();
        expect(entity.WhenCreated).toBeInstanceOf(Date);
        expect(entity.WhenUpdated).toBeInstanceOf(Date);
    });
});

describe("Save", () => {
    test("EXPECT entity to be saved", async () => {
        const entity = new BaseEntity();

        // Force the WhenUpdated property to be earlier than the current date
        entity.WhenUpdated = new Date(new Date().getTime() - 1000);
        const oldDate = entity.WhenUpdated;

        // Mock the repository save method
        const mockSave = jest.fn();
        const mockRepository = {
            save: mockSave
        };
        AppDataSource.getRepository = jest.fn().mockReturnValue(mockRepository);

        await entity.Save(BaseEntity, entity);

        expect(entity.WhenUpdated).not.toEqual(oldDate);
        expect(mockSave).toHaveBeenCalledWith(entity);
    });
});

describe("Remove", () => {
    test("EXPECT entity to be removed", async () => {
        const entity = new BaseEntity();

        // Mock the repository remove method
        const mockRemove = jest.fn();
        const mockRepository = {
            remove: mockRemove
        };
        AppDataSource.getRepository = jest.fn().mockReturnValue(mockRepository);

        await BaseEntity.Remove(BaseEntity, entity);

        expect(mockRemove).toHaveBeenCalledWith(entity);
    });
});

describe("FetchAll", () => {
    test("GIVEN relations parameter is null, EXPECT flat entity returned", async () => {
        const entities = [new BaseEntity(), new BaseEntity()];

        // Mock the repository find method
        const mockFind = jest.fn().mockResolvedValue(entities);
        const mockRepository = {
            find: mockFind
        };
        AppDataSource.getRepository = jest.fn().mockReturnValue(mockRepository);

        const result = await BaseEntity.FetchAll(BaseEntity);

        expect(result).toEqual(entities);
        expect(mockFind).toHaveBeenCalledWith({ relations: [] });
    });

    test("GIVEN relations parameter is not supplied, EXPECT flat entity returned", async () => {
        const entities = [new BaseEntity(), new BaseEntity()];

        // Mock the repository find method
        const mockFind = jest.fn().mockResolvedValue(entities);
        const mockRepository = {
            find: mockFind
        };
        AppDataSource.getRepository = jest.fn().mockReturnValue(mockRepository);

        const result = await BaseEntity.FetchAll(BaseEntity, []);

        expect(result).toEqual(entities);
        expect(mockFind).toHaveBeenCalledWith({ relations: [] });
    });

    test("GIVEN relations parameter is set, EXPECT relations to be used in repository", async () => {
        const entities = [new BaseEntity(), new BaseEntity()];
        const relations = ["relation1", "relation2"];

        // Mock the repository find method
        const mockFind = jest.fn().mockResolvedValue(entities);
        const mockRepository = {
            find: mockFind
        };
        AppDataSource.getRepository = jest.fn().mockReturnValue(mockRepository);

        const result = await BaseEntity.FetchAll(BaseEntity, relations);

        expect(result).toEqual(entities);
        expect(mockFind).toHaveBeenCalledWith({ relations });
    });
});

describe("FetchOneById", () => {
    test("GIVEN relations parameter is null, EXPECT flat entity returned", async () => {
        const entity = new BaseEntity();
        const id = "123";

        // Mock the repository findOne method
        const mockFindOne = jest.fn().mockResolvedValue(entity);
        const mockRepository = {
            findOne: mockFindOne
        };
        AppDataSource.getRepository = jest.fn().mockReturnValue(mockRepository);

        const result = await BaseEntity.FetchOneById(BaseEntity, id);

        expect(result).toEqual(entity);
        expect(mockFindOne).toHaveBeenCalledWith({ where: { Id: id }, relations: [] });
    });

    test("GIVEN relations parameter is not supplied, EXPECT flat entity returned", async () => {
        const entity = new BaseEntity();
        const id = "123";

        // Mock the repository findOne method
        const mockFindOne = jest.fn().mockResolvedValue(entity);
        const mockRepository = {
            findOne: mockFindOne
        };
        AppDataSource.getRepository = jest.fn().mockReturnValue(mockRepository);

        const result = await BaseEntity.FetchOneById(BaseEntity, id, []);

        expect(result).toEqual(entity);
        expect(mockFindOne).toHaveBeenCalledWith({ where: { Id: id }, relations: [] });
    });

    test("GIVEN relations parameter is set, EXPECT relations to be used in repository", async () => {
        const entity = new BaseEntity();
        const id = "123";
        const relations = ["relation1", "relation2"];

        // Mock the repository findOne method
        const mockFindOne = jest.fn().mockResolvedValue(entity);
        const mockRepository = {
            findOne: mockFindOne
        };
        AppDataSource.getRepository = jest.fn().mockReturnValue(mockRepository);

        const result = await BaseEntity.FetchOneById(BaseEntity, id, relations);

        expect(result).toEqual(entity);
        expect(mockFindOne).toHaveBeenCalledWith({ where: { Id: id }, relations });
    });
});

describe("Any", () => {
    test("GIVEN there are entities in the repository, EXPECT true returned", async () => {
        const entities = [new BaseEntity(), new BaseEntity()];

        // Mock the repository find method
        const mockFind = jest.fn().mockResolvedValue(entities);
        const mockRepository = {
            find: mockFind
        };
        AppDataSource.getRepository = jest.fn().mockReturnValue(mockRepository);

        const result = await BaseEntity.Any(BaseEntity);

        expect(result).toBe(true);
        expect(mockFind).toHaveBeenCalled();
    });

    test("GIVEN no entities are in the repository, EXPECT false returned", async () => {
        const entities: BaseEntity[] = [];

        // Mock the repository find method
        const mockFind = jest.fn().mockResolvedValue(entities);
        const mockRepository = {
            find: mockFind
        };
        AppDataSource.getRepository = jest.fn().mockReturnValue(mockRepository);

        const result = await BaseEntity.Any(BaseEntity);

        expect(result).toBe(false);
        expect(mockFind).toHaveBeenCalled();
    });
});