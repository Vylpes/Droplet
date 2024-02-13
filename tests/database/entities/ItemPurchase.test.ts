import { ItemPurchase } from "../../../src/database/entities/ItemPurchase";
import { Item } from "../../../src/database/entities/Item";
import { ItemPurchaseStatus, ItemPurchaseStatusNames } from "../../../src/constants/Status/ItemPurchaseStatus";

describe("constructor", () => {
    test("EXPECT properties to be set", () => {
        // Arrange
        const description = "Test Description";
        const price = 10;

        // Act
        const itemPurchase = new ItemPurchase(description, price);

        // Assert
        expect(itemPurchase.Description).toBe(description);
        expect(itemPurchase.Status).toBe(ItemPurchaseStatus.Ordered);
        expect(itemPurchase.Price).toBe(price);
    });
});

describe("StatusName", () => {
    test("EXPECT status friendly name to be returned", () => {
        // Arrange
        const itemPurchase = new ItemPurchase("Test Description", 10);
        itemPurchase.Status = ItemPurchaseStatus.Ordered;
        ItemPurchaseStatusNames.get = jest.fn().mockReturnValue("Ordered");

        // Act
        const statusName = itemPurchase.StatusName();

        // Assert
        expect(statusName).toBe("Ordered");
        expect(ItemPurchaseStatusNames.get).toBeCalledWith(ItemPurchaseStatus.Ordered);
    });
});

describe("UpdateBasicDetails", () => {
    test("EXPECT properties to be updated", () => {
        // Arrange
        const itemPurchase = new ItemPurchase("Test Description", 10);
        const newDescription = "New Description";
        const newPrice = 20;

        // Act
        itemPurchase.UpdateBasicDetails(newDescription, newPrice);

        // Assert
        expect(itemPurchase.Description).toBe(newDescription);
        expect(itemPurchase.Price).toBe(newPrice);
    });
});

describe("UpdateStatus", () => {
    test("EXPECT status to be updated", () => {
        // Arrange
        const itemPurchase = new ItemPurchase("Test Description", 10);
        const newStatus = ItemPurchaseStatus.Complete;

        // Act
        itemPurchase.UpdateStatus(newStatus);

        // Assert
        expect(itemPurchase.Status).toBe(newStatus);
    });
});

describe("AddItemToOrder", () => {
    test("EXPECT item to be pushed", () => {
        // Arrange
        const itemPurchase = new ItemPurchase("Test Description", 10);
        itemPurchase.Items = [];
        const item = new Item("name", 10);

        // Act
        itemPurchase.AddItemToOrder(item);

        // Assert
        expect(itemPurchase.Items).toContain(item);
    });
});

describe("CalculateItemPrices", () => {
    test("EXPECT item prices to be updated based on purchase price", async () => {
        // Arrange
        const itemPurchase = new ItemPurchase("Test Description", 10);
        itemPurchase.Items = [];
        const item1 = new Item("item1", 1);
        item1.Save = jest.fn();
        const item2 = new Item("item2", 1);
        item2.Save = jest.fn();
        itemPurchase.AddItemToOrder(item1);
        itemPurchase.AddItemToOrder(item2);

        // Act
        await itemPurchase.CalculateItemPrices();

        // Assert
        expect(item1.BuyPrice).toBe(5);
        expect(item2.BuyPrice).toBe(5);
        expect(item1.Save).toBeCalledWith(Item, item1);
        expect(item2.Save).toBeCalledWith(Item, item2);
    });

    test("GIVEN items relation is null, EXPECT nothing to happen", async () => {
        // Arrange
        const itemPurchase = new ItemPurchase("Test Description", 10);

        // Act
        await itemPurchase.CalculateItemPrices();

        // Assert
        // No assertions needed, the method should not throw an error
    });

    test("GIVEN an assign item has 0 quantity, EXPECT buy price to be set to 0", async () => {
        // Arrange
        const itemPurchase = new ItemPurchase("Test Description", 10);
        itemPurchase.Items = [];
        const item1 = new Item("item1", 0);
        const item2 = new Item("item2", 0);
        item1.UnlistedQuantity = 0;
        item1.ListedQuantity = 0;
        item1.SoldQuantity = 0;
        item1.RejectedQuantity = 0;
        item1.Save = jest.fn();
        item2.UnlistedQuantity = 0;
        item2.ListedQuantity = 0;
        item2.SoldQuantity = 0;
        item2.RejectedQuantity = 0;
        item2.Save = jest.fn();
        itemPurchase.AddItemToOrder(item1);
        itemPurchase.AddItemToOrder(item2);

        // Act
        await itemPurchase.CalculateItemPrices();

        // Assert
        expect(item1.BuyPrice).toBe(0);
        expect(item2.BuyPrice).toBe(0);
        expect(item1.Save).toBeCalledWith(Item, item1);
        expect(item2.Save).toBeCalledWith(Item, item2);
    });
});