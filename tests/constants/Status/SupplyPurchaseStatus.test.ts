import { SupplyPurchaseStatus, SupplyPurchaseStatusNames } from '../../../src/constants/Status/SupplyPurchaseStatus';

describe('SupplyPurchaseStatusNames', () => {
    test('GIVEN input is Ordered, EXPECT Ordered string returned', () => {
        expect(SupplyPurchaseStatusNames.get(SupplyPurchaseStatus.Ordered)).toBe("Ordered");
    });

    test('GIVEN input is Received, EXPECT Received string returned', () => {
        expect(SupplyPurchaseStatusNames.get(SupplyPurchaseStatus.Received)).toBe("Received");
    });

    test('GIVEN input is Inventoried, EXPECT Inventoried string returned', () => {
        expect(SupplyPurchaseStatusNames.get(SupplyPurchaseStatus.Inventoried)).toBe("Inventoried");
    });

    test('GIVEN input is Complete, EXPECT Complete string returned', () => {
        expect(SupplyPurchaseStatusNames.get(SupplyPurchaseStatus.Complete)).toBe("Complete");
    });

    test('GIVEN input is Rejected, EXPECT Rejected string returned', () => {
        expect(SupplyPurchaseStatusNames.get(SupplyPurchaseStatus.Rejected)).toBe("Rejected");
    });
});