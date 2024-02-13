import { StorageType } from '../../../src/constants/StorageType';
import { Item } from '../../../src/database/entities/Item';
import { Storage } from '../../../src/database/entities/Storage';

describe("constructor", () => {
    test("EXPECT properties to be set", () => {
        // Arrange
        const name = "Test Storage";
        const skuPrefix = "TS";
        const storageType = StorageType.Bin;

        // Act
        const storage = new Storage(name, skuPrefix, storageType);

        // Assert
        expect(storage.Name).toBe(name);
        expect(storage.SkuPrefix).toBe(skuPrefix);
        expect(storage.StorageType).toBe(storageType);
        expect(storage.ItemCounter).toBe(0);
    });
});

describe("StorageTypeName", () => {
    test("EXPECT friendly type name to be returned", () => {
        // Arrange
        const name = "Test Storage";
        const skuPrefix = "TS";
        const storageType = StorageType.Bin;
        const storage = new Storage(name, skuPrefix, storageType);

        // Act
        const typeName = storage.StorageTypeName();

        // Assert
        expect(typeName).toBe("Bin");
    });
});

describe("UpdateBasicDetails", () => {
    test("EXPECT properties to be updated", () => {
        // Arrange
        const name = "Test Storage";
        const skuPrefix = "TS";
        const storageType = StorageType.Bin;
        const storage = new Storage(name, skuPrefix, storageType);

        // Act
        storage.UpdateBasicDetails("Updated Storage", StorageType.Building);

        // Assert
        expect(storage.Name).toBe("Updated Storage");
        expect(storage.StorageType).toBe(StorageType.Building);
    });
});

describe("AssignParentStorage", () => {
    test("EXPECT entity to be assigned", () => {
        // Arrange
        const name = "Test Storage";
        const skuPrefix = "TS";
        const storageType = StorageType.Bin;
        const storage = new Storage(name, skuPrefix, storageType);
        const parentStorage = new Storage("Parent Storage", "PS", StorageType.Building);

        // Act
        storage.AssignParentStorage(parentStorage);

        // Assert
        expect(storage.Parent).toBe(parentStorage);
    });

    test("GIVEN storage type is a building, EXPECT nothing to happen", () => {
        // Arrange
        const name = "Test Storage";
        const skuPrefix = "TS";
        const storageType = StorageType.Building;
        const storage = new Storage(name, skuPrefix, storageType);
        const parentStorage = new Storage("Parent Storage", "PS", StorageType.Building);
        storage.Parent = parentStorage;

        // Act
        storage.AssignParentStorage(new Storage("New Parent Storage", "NPS", StorageType.Bin));

        // Assert
        expect(storage.Parent).toBe(parentStorage);
    });
});

describe("AddItemToBin", () => {
    test("EXPECT entity to be pushed", () => {
        // Arrange
        const name = "Test Storage";
        const skuPrefix = "TS";
        const storageType = StorageType.Bin;
        const storage = new Storage(name, skuPrefix, storageType);
        storage.Items = [];
        const item = new Item("Test Item", 10);

        // Act
        storage.AddItemToBin(item);

        // Assert
        expect(storage.Items).toContain(item);
        expect(storage.ItemCounter).toBe(1);
    });

    test("GIVEN storage type is not a bin, EXPECT nothing to happen", () => {
        // Arrange
        const name = "Test Storage";
        const skuPrefix = "TS";
        const storageType = StorageType.Building;
        const storage = new Storage(name, skuPrefix, storageType);
        storage.Items = [];
        const item = new Item("Test Item", 10);

        // Act
        storage.AddItemToBin(item);

        // Assert
        expect(storage.Items).not.toContain(item);
        expect(storage.ItemCounter).toBe(0);
    });
});