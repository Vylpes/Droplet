import { ItemStatus } from "../../src/constants/Status/ItemStatus";
import { Item } from "../../src/database/entities/Item";

describe("Item domain methods", () => {
    it("EditQuantities recalculates status with Unlisted priority", () => {
        const item = new Item("Widget", 0);

        item.EditQuantities(2, 3, 1, 1);
        expect(item.Status).toBe(ItemStatus.Unlisted);

        item.EditQuantities(0, 3, 1, 1);
        expect(item.Status).toBe(ItemStatus.Listed);

        item.EditQuantities(0, 0, 1, 1);
        expect(item.Status).toBe(ItemStatus.Sold);

        item.EditQuantities(0, 0, 0, 1);
        expect(item.Status).toBe(ItemStatus.Rejected);

        item.EditQuantities(0, 0, 0, 0);
        expect(item.Status).toBe(ItemStatus.Rejected);
    });

    it("MarkAsListed moves quantity from unlisted and recalculates status", () => {
        const item = new Item("Widget", 5);

        item.MarkAsListed(2, ItemStatus.Unlisted);

        expect(item.UnlistedQuantity).toBe(3);
        expect(item.ListedQuantity).toBe(2);
        expect(item.Status).toBe(ItemStatus.Unlisted);
    });

    it("MarkAsSold depletes listed stock and can become Sold", () => {
        const item = new Item("Widget", 0);
        item.ListedQuantity = 2;
        item.Status = ItemStatus.Listed;

        item.MarkAsSold(2, ItemStatus.Listed);

        expect(item.ListedQuantity).toBe(0);
        expect(item.SoldQuantity).toBe(2);
        expect(item.Status).toBe(ItemStatus.Sold);
    });

    it("MarkAsRejected moves from unlisted", () => {
        const item = new Item("Widget", 3);

        item.MarkAsRejected(3, ItemStatus.Unlisted);

        expect(item.UnlistedQuantity).toBe(0);
        expect(item.RejectedQuantity).toBe(3);
        expect(item.Status).toBe(ItemStatus.Rejected);
    });
});
