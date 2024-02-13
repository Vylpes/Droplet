import { SupplyPurchaseStatus, SupplyPurchaseStatusNames } from "../../../src/constants/Status/SupplyPurchaseStatus";
import { Supply } from "../../../src/database/entities/Supply";
import { SupplyPurchase } from "../../../src/database/entities/SupplyPurchase";

describe("constructor", () => {
    test("EXPECT properties to be set", () => {
        const description = "Test Description";
        const price = 10.99;

        const supplyPurchase = new SupplyPurchase(description, price);

        expect(supplyPurchase.Id).toBeDefined();
        expect(supplyPurchase.Description).toBe(description);
        expect(supplyPurchase.Status).toBe(SupplyPurchaseStatus.Ordered);
        expect(supplyPurchase.Price).toBe(price);
    });
});

describe("StatusName", () => {
    test("EXPECT friendly text to be returned", () => {
        const supplyPurchase = new SupplyPurchase("Test Description", 10.99);
        SupplyPurchaseStatusNames.get = jest.fn().mockReturnValue("Ordered");

        const statusName = supplyPurchase.StatusName();

        expect(statusName).toBe("Ordered");
        expect(SupplyPurchaseStatusNames.get).toHaveBeenCalledWith(SupplyPurchaseStatus.Ordered);
    });
});

describe("UpdateBasicDetails", () => {
    test("EXPECT properties to be updated", () => {
        const supplyPurchase = new SupplyPurchase("Test Description", 10.99);

        const newDescription = "Updated Description";
        const newPrice = 19.99;

        supplyPurchase.UpdateBasicDetails(newDescription, newPrice);

        expect(supplyPurchase.Description).toBe(newDescription);
        expect(supplyPurchase.Price).toBe(newPrice);
    });
});

describe("UpdateStatus", () => {
    test("EXPECT status to be updated", () => {
        const supplyPurchase = new SupplyPurchase("Test Description", 10.99);

        const newStatus = SupplyPurchaseStatus.Complete;

        supplyPurchase.UpdateStatus(newStatus);

        expect(supplyPurchase.Status).toBe(newStatus);
    });
});

describe("AddSupplyToOrder", () => {
    test("EXPECT entity to be pushed", () => {
        const supplyPurchase = new SupplyPurchase("Test Description", 10);
        supplyPurchase.Supplies = [];
        const supply = new Supply("name", "sku", 1);

        supplyPurchase.AddSupplyToOrder(supply);

        expect(supplyPurchase.Supplies).toContain(supply);
    });
});

describe("CalculateItemPrice", () => {
    test("EXPECT item prices to be updated", async () => {
        const supplyPurchase = new SupplyPurchase("Test Description", 10);
        const supply1 = new Supply("supply1", "sku1", 1);
        supply1.Save = jest.fn();
        const supply2 = new Supply("supply2", "sku2", 1);
        supply2.Save = jest.fn();
        supplyPurchase.Supplies = [supply1, supply2];

        await supplyPurchase.CalculateItemPrices();

        expect(supply1.BuyPrice).toBe(5);
        expect(supply2.BuyPrice).toBe(5);

        expect(supply1.Save).toHaveBeenCalledWith(Supply, supply1);
        expect(supply2.Save).toHaveBeenCalledWith(Supply, supply2);
    });

    test("GIVEN supply quantity is 0, EXPECT buy price to be set to 0", async () => {
        const supplyPurchase = new SupplyPurchase("Test Description", 10.99);
        const supply = new Supply("name", "sku", 1);
        supply.UnusedQuantity = 0;
        supply.UsedQuantity = 0;
        supply.Save = jest.fn();
        supplyPurchase.Supplies = [supply];

        await supplyPurchase.CalculateItemPrices();

        expect(supply.BuyPrice).toBe(0);
        expect(supply.Save).toHaveBeenCalledWith(Supply, supply);
    });
});