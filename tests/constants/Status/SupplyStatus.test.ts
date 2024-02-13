import { SupplyStatus, SupplyStatusNames } from '../../../src/constants/Status/SupplyStatus';

describe('SupplyStatusNames', () => {
    test('GIVEN input is Unused, EXPECT Unused string returned', () => {
        expect(SupplyStatusNames.get(SupplyStatus.Unused)).toBe("Unused");
    });

    test('GIVEN input is Used, EXPECT Used string returned', () => {
        expect(SupplyStatusNames.get(SupplyStatus.Used)).toBe("Used");
    });
});