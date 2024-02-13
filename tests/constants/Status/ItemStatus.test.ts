import { ItemStatus, ItemStatusNames } from '../../../src/constants/Status/ItemStatus';

describe('ItemStatusNames', () => {
    test('GIVEN input is Unlisted, EXPECT Unlisted string returned', () => {
        expect(ItemStatusNames.get(ItemStatus.Unlisted)).toBe("Unlisted");
    });

    test('GIVEN input is Listed, EXPECT Listed string returned', () => {
        expect(ItemStatusNames.get(ItemStatus.Listed)).toBe("Listed");
    });

    test('GIVEN input is Sold, EXPECT Sold string returned', () => {
        expect(ItemStatusNames.get(ItemStatus.Sold)).toBe("Sold");
    });

    test('GIVEN input is Rejected, EXPECT Rejected string returned', () => {
        expect(ItemStatusNames.get(ItemStatus.Rejected)).toBe("Rejected");
    });
});