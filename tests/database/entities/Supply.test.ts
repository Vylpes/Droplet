import { SupplyStatus, SupplyStatusNames } from "../../../src/constants/Status/SupplyStatus";
import { Supply } from "../../../src/database/entities/Supply";
import { SupplyPurchase } from "../../../src/database/entities/SupplyPurchase";

let supply: Supply;

beforeEach(() => {
    supply = new Supply("Test Supply", "SKU123", 10);
    supply.Orders = [];
});

describe("constructor", () => {
    test("EXPECT properties to be set", () => {
        expect(supply.Id).toBeDefined();
        expect(supply.Name).toBe("Test Supply");
        expect(supply.Sku).toBe("SKU123");
        expect(supply.UnusedQuantity).toBe(10);
        expect(supply.UsedQuantity).toBe(0);
        expect(supply.Status).toBe(SupplyStatus.Unused);
        expect(supply.BuyPrice).toBe(0);
        expect(supply.Purchase).toBeUndefined();
        expect(supply.Orders).toEqual([]);
    });
});

describe("StatusName", () => {
    test("EXPECT friendly text to be returned", () => {
        SupplyStatusNames.get = jest.fn().mockReturnValue("Unused");

        expect(supply.StatusName()).toBe("Unused");
        expect(SupplyStatusNames.get).toHaveBeenCalledWith(SupplyStatus.Unused);
    });
});

describe("EditBasicDetails", () => {
    test("EXPECT properties to be updated", () => {
        supply.EditBasicDetails("Updated Supply", "SKU456");

        expect(supply.Name).toBe("Updated Supply");
        expect(supply.Sku).toBe("SKU456");
    });
});

describe("AddStock", () => {
    test("EXPECT quantities to be updated", () => {
        supply.AddStock(5);

        expect(supply.UnusedQuantity).toBe(15);
        expect(supply.UsedQuantity).toBe(0);
    });

    test("GIVEN status was used, EXPECT status to be updated", () => {
        supply.UpdateStatus(SupplyStatus.Used);
        supply.AddStock(5);

        expect(supply.Status).toBe(SupplyStatus.Unused);
    });
});

describe("RemoveStock", () => {
    test("EXPECT stock to be removed", () => {
        supply.RemoveStock(5);

        expect(supply.UnusedQuantity).toBe(5);
        expect(supply.UsedQuantity).toBe(5);
    });

    test("GIVEN amount parameter is more than the unused stock remaining, EXPECT nothing to happen", () => {
        supply.RemoveStock(15);

        expect(supply.UnusedQuantity).toBe(10);
        expect(supply.UsedQuantity).toBe(0);
    });

    test("GIVEN there are no more unused stock, EXPECT status to be updated", () => {
        supply.RemoveStock(10);

        expect(supply.Status).toBe(SupplyStatus.Used);
    });
});

describe("SetStock", () => {
    test("EXPECT properties to be updated", () => {
        supply.SetStock(5, 3);

        expect(supply.UnusedQuantity).toBe(5);
        expect(supply.UsedQuantity).toBe(3);
    });
});

describe("UpdateStatus", () => {
    test("EXPECT status to be updated", () => {
        supply.UpdateStatus(SupplyStatus.Used);

        expect(supply.Status).toBe(SupplyStatus.Used);
    });
});

describe("SetBuyPrice", () => {
    test("EXPECT price to be updated", () => {
        supply.SetBuyPrice(9.99);

        expect(supply.BuyPrice).toBe(9.99);
    });
});

describe("AssignPurchase", () => {
    test("EXPECT entity to be assigned", () => {
        const purchase = new SupplyPurchase("description", 10);
        supply.AssignToPurchase(purchase);

        expect(supply.Purchase).toBe(purchase);
    });
});