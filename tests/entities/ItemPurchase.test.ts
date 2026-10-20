import { ItemPurchaseStatus } from "../../src/constants/Status/ItemPurchaseStatus";
import { Item } from "../../src/database/entities/Item";
import { ItemPurchase } from "../../src/database/entities/ItemPurchase";

describe("ItemPurchase domain methods", () => {
    it("UpdateStatus sets the purchase status", () => {
        const purchase = new ItemPurchase("Widgets", 30);

        purchase.UpdateStatus(ItemPurchaseStatus.Received);

        expect(purchase.Status).toBe(ItemPurchaseStatus.Received);
    });

    it("CalculateItemPrices splits buy price across items with stock", async () => {
        const purchase = new ItemPurchase("Widgets", 30);
        const itemA = new Item("A", 2);
        const itemB = new Item("B", 1);
        const empty = new Item("Empty", 0);
        empty.UnlistedQuantity = 0;

        jest.spyOn(itemA, "Save").mockResolvedValue(undefined);
        jest.spyOn(itemB, "Save").mockResolvedValue(undefined);
        jest.spyOn(empty, "Save").mockResolvedValue(undefined);

        purchase.Items = [itemA, itemB, empty];

        await purchase.CalculateItemPrices();

        // pricePerItem = 30 / 2 stocked items = 15
        expect(itemA.BuyPrice).toBe(7.5); // 15 / qty 2
        expect(itemB.BuyPrice).toBe(15); // 15 / qty 1
        expect(empty.BuyPrice).toBe(0);
    });
});
