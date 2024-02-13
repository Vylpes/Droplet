import { ListingStatus, ListingStatusNames } from '../../../src/constants/Status/ListingStatus';

describe('ListingStatusNames', () => {
    test('GIVEN input is Active, EXPECT Active string returned', () => {
        expect(ListingStatusNames.get(ListingStatus.Active)).toBe("Active");
    });

    test('GIVEN input is Sold, EXPECT Sold string returned', () => {
        expect(ListingStatusNames.get(ListingStatus.Sold)).toBe("Sold");
    });

    test('GIVEN input is Unsold, EXPECT Unsold string returned', () => {
        expect(ListingStatusNames.get(ListingStatus.Unsold)).toBe("Unsold");
    });
});