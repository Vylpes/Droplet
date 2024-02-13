import { ItemPurchaseStatus, ItemPurchaseStatusNames } from '../../../src/constants/Status/ItemPurchaseStatus';

describe('ItemPurchaseStatusNames', () => {
    test('GIVEN input is Ordered, EXPECT Ordered string returned', () => {
        expect(ItemPurchaseStatusNames.get(ItemPurchaseStatus.Ordered)).toBe("Ordered");
    });

    test('GIVEN input is Received, EXPECT Received string returned', () => {
        expect(ItemPurchaseStatusNames.get(ItemPurchaseStatus.Received)).toBe("Received");
    });

    test('GIVEN input is Inventoried, EXPECT Inventoried string returned', () => {
        expect(ItemPurchaseStatusNames.get(ItemPurchaseStatus.Inventoried)).toBe("Inventoried");
    });

    test('GIVEN input is Complete, EXPECT Complete string returned', () => {
        expect(ItemPurchaseStatusNames.get(ItemPurchaseStatus.Complete)).toBe("Complete");
    });

    test('GIVEN input is Rejected, EXPECT Rejected string returned', () => {
        expect(ItemPurchaseStatusNames.get(ItemPurchaseStatus.Rejected)).toBe("Rejected");
    });
});