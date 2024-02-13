import { StorageType, StorageTypeNames } from '../../src/constants/StorageType';

describe('StorageTypeNames', () => {
    test("GIVEN input is Bin, EXPECT Bin string returned", () => {
        expect(StorageTypeNames.get(StorageType.Bin)).toBe("Bin");
    });

    test("GIVEN input is Unit, EXPECT Unit string returned", () => {
        expect(StorageTypeNames.get(StorageType.Unit)).toBe("Unit");
    });

    test("GIVEN input is Building, EXPECT Building string returned", () => {
        expect(StorageTypeNames.get(StorageType.Building)).toBe("Building");
    });
});