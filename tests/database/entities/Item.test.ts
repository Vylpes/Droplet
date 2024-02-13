import { ItemStatus } from "../../../src/constants/Status/ItemStatus";
import { Item } from "../../../src/database/entities/Item";

describe("constructor", () => {
    test("EXPECT properties to be set", () => {
        const name = "Test Item";
        const quantity = 10;

        const item = new Item(name, quantity);

        expect(item.Id).toBeDefined();
        expect(item.Name).toBe(name);
        expect(item.Sku).toBe("");
        expect(item.UnlistedQuantity).toBe(quantity);
        expect(item.ListedQuantity).toBe(0);
        expect(item.SoldQuantity).toBe(0);
        expect(item.RejectedQuantity).toBe(0);
        expect(item.Status).toBe(ItemStatus.Unlisted);
        expect(item.BuyPrice).toBe(0);
        expect(item.Purchase).toBeUndefined();
        expect(item.Listings).toBeUndefined();
        expect(item.Storage).toBeUndefined();
    });
});

describe("StatusName", () => {
    test("EXPECT status to be returned as a friendly string", () => {
        const item = new Item("Test Item", 10);
        item.Status = ItemStatus.Listed;

        const statusName = item.StatusName();

        expect(statusName).toBe("Listed");
    });
});

describe("EditBasicDetails", () => {
    test("EXPECT details to be updated", () => {
        const item = new Item("Test Item", 10);
        const newName = "Updated Item Name";

        item.EditBasicDetails(newName);

        expect(item.Name).toBe(newName);
        expect(item.WhenUpdated).toBeDefined();
    });
});

describe("EditQuantities", () => {
    test("EXPECT quantities to be updated", () => {
        const item = new Item("Test Item", 10);
        const unlisted = 5;
        const listed = 3;
        const sold = 2;
        const rejected = 1;

        item.EditQuantities(unlisted, listed, sold, rejected);

        expect(item.UnlistedQuantity).toBe(unlisted);
        expect(item.ListedQuantity).toBe(listed);
        expect(item.SoldQuantity).toBe(sold);
        expect(item.RejectedQuantity).toBe(rejected);
        expect(item.WhenUpdated).toBeDefined();
    });
});

describe("GenerateSku", () => {
    test("GIVEN all storages are present, EXPECT full sku to be set", () => {
        const item = new Item("Test Item", 10);
        const storage = {
            Parent: {
                Parent: {
                    SkuPrefix: "B"
                },
                SkuPrefix: "U"
            },
            SkuPrefix: "BIN",
            ItemCounter: 1
        };

        item.Storage = storage as any;
        item.GenerateSku();

        expect(item.Sku).toBe("BUBIN-0001");
    });

    test("GIVEN buildingPrefix is empty, EXPECT building prefix to be blank", () => {
        const item = new Item("Test Item", 10);
        const storage = {
            Parent: {
                Parent: {
                    SkuPrefix: ""
                },
                SkuPrefix: "U"
            },
            SkuPrefix: "BIN",
            ItemCounter: 1
        };

        item.Storage = storage as any;
        item.GenerateSku();

        expect(item.Sku).toBe("UBIN-0001");
    });

    test("GIVEN unitPrefix is empty, EXPECT unit prefix to be blank", () => {
        const item = new Item("Test Item", 10);
        const storage = {
            Parent: {
                Parent: {
                    SkuPrefix: "B"
                },
                SkuPrefix: ""
            },
            SkuPrefix: "BIN",
            ItemCounter: 1
        };

        item.Storage = storage as any;
        item.GenerateSku();

        expect(item.Sku).toBe("BBIN-0001");
    });

    test("GIVEN binPrefix is empty, EXPECT bin prefix to be blank", () => {
        const item = new Item("Test Item", 10);
        const storage = {
            Parent: {
                Parent: {
                    SkuPrefix: "B"
                },
                SkuPrefix: "U"
            },
            SkuPrefix: "",
            ItemCounter: 1
        };

        item.Storage = storage as any;
        item.GenerateSku();

        expect(item.Sku).toBe("BU-0001");
    });

    test("GIVEN itemCounter is 0, EXPECT itemCounter to be 0", () => {
        const item = new Item("Test Item", 10);
        const storage = {
            Parent: {
                Parent: {
                    SkuPrefix: "B"
                },
                SkuPrefix: "U"
            },
            SkuPrefix: "BIN",
            ItemCounter: 0
        };

        item.Storage = storage as any;
        item.GenerateSku();

        expect(item.Sku).toBe("BUBIN-0000");
    });
});

describe("UpdateStatus", () => {
    test("EXPECT status to be updated", () => {
        const item = new Item("Test Item", 10);
        const newStatus = ItemStatus.Listed;

        item.UpdateStatus(newStatus);

        expect(item.Status).toBe(newStatus);
        expect(item.WhenUpdated).toBeDefined();
    });
});

describe("SetBuyPrice", () => {
    test("EXPECT buy price to be updated", () => {
        const item = new Item("Test Item", 10);
        const newPrice = 9.99;

        item.SetBuyPrice(newPrice);

        expect(item.BuyPrice).toBe(newPrice);
        expect(item.WhenUpdated).toBeDefined();
    });
});

describe("AssignToPurchase", () => {
    test("EXPECT purchase to be assigned", () => {
        const item = new Item("Test Item", 10);
        const purchase = {} as any;

        item.AssignToPurchase(purchase);

        expect(item.Purchase).toBe(purchase);
        expect(item.WhenUpdated).toBeDefined();
    });
});

describe("MarkAsUnlisted", () => {
    test("EXPECT properties to be updated", () => {
        const item = new Item("Test Item", 0);
        item.ListedQuantity = 10;

        item.MarkAsUnlisted(5, ItemStatus.Listed);

        expect(item.UnlistedQuantity).toBe(5);
        expect(item.ListedQuantity).toBe(5);
        expect(item.Status).toBe(ItemStatus.Unlisted);
        expect(item.WhenUpdated).toBeDefined();
    });

    test("GIVEN all unlisted or listed, EXPECT status to be unlisted", () => {
        const item = new Item("Test Item", 10);

        item.MarkAsListed(5, ItemStatus.Unlisted);

        expect(item.UnlistedQuantity).toBe(5);
        expect(item.ListedQuantity).toBe(5);
        expect(item.Status).toBe(ItemStatus.Unlisted);
        expect(item.WhenUpdated).toBeDefined();
    });
});

describe("MarkAsListed", () => {
    test("EXPECT properties to be updated", () => {
        const item = new Item("Test Item", 10);

        item.MarkAsListed(3, ItemStatus.Unlisted);

        expect(item.ListedQuantity).toBe(3);
        expect(item.UnlistedQuantity).toBe(7);
        expect(item.Status).toBe(ItemStatus.Unlisted);
        expect(item.WhenUpdated).toBeDefined();
    });

    test("GIVEN all listed, EXPECT status to be listed", () => {
        const item = new Item("Test Item", 10);

        item.MarkAsListed(10, ItemStatus.Unlisted);

        expect(item.ListedQuantity).toBe(10);
        expect(item.UnlistedQuantity).toBe(0);
        expect(item.Status).toBe(ItemStatus.Listed);
        expect(item.WhenUpdated).toBeDefined();
    });

    test("GIVEN all listed or sold, EXPECT status to be listed", () => {
        const item = new Item("Test Item", 10);

        item.MarkAsListed(5, ItemStatus.Unlisted);
        item.MarkAsSold(5, ItemStatus.Unlisted);

        expect(item.ListedQuantity).toBe(5);
        expect(item.SoldQuantity).toBe(5);
        expect(item.UnlistedQuantity).toBe(0);
        expect(item.Status).toBe(ItemStatus.Listed);
        expect(item.WhenUpdated).toBeDefined();
    });
});

describe("MarkAsSold", () => {
    test("EXPECT properties to be updated", () => {
        const item = new Item("Test Item", 10);

        item.MarkAsSold(2, ItemStatus.Unlisted);

        expect(item.SoldQuantity).toBe(2);
        expect(item.UnlistedQuantity).toBe(8);
        expect(item.Status).toBe(ItemStatus.Unlisted);
        expect(item.WhenUpdated).toBeDefined();
    });

    test("GIVEN all sold, EXPECT status to be sold", () => {
        const item = new Item("Test Item", 10);

        item.MarkAsSold(10, ItemStatus.Unlisted);

        expect(item.SoldQuantity).toBe(10);
        expect(item.UnlistedQuantity).toBe(0);
        expect(item.Status).toBe(ItemStatus.Sold);
        expect(item.WhenUpdated).toBeDefined();
    });

    test("GIVEN all sold or rejected, EXPECT status to be sold", () => {
        const item = new Item("Test Item", 10);

        item.MarkAsSold(5, ItemStatus.Unlisted);
        item.MarkAsRejected(5, ItemStatus.Unlisted);

        expect(item.SoldQuantity).toBe(5);
        expect(item.RejectedQuantity).toBe(5);
        expect(item.UnlistedQuantity).toBe(0);
        expect(item.Status).toBe(ItemStatus.Sold);
        expect(item.WhenUpdated).toBeDefined();
    });
});

describe("MarkAsRejected", () => {
    test("EXPECT properties to be updated", () => {
        const item = new Item("Test Item", 10);

        item.MarkAsRejected(1, ItemStatus.Unlisted);

        expect(item.RejectedQuantity).toBe(1);
        expect(item.UnlistedQuantity).toBe(9);
        expect(item.Status).toBe(ItemStatus.Unlisted);
        expect(item.WhenUpdated).toBeDefined();
    });

    test("GIVEN all rejected, EXPECT status to be rejected", () => {
        const item = new Item("Test Item", 10);

        item.MarkAsRejected(10, ItemStatus.Unlisted);

        expect(item.RejectedQuantity).toBe(10);
        expect(item.UnlistedQuantity).toBe(0);
        expect(item.Status).toBe(ItemStatus.Rejected);
        expect(item.WhenUpdated).toBeDefined();
    });
});

describe("SetStorageBin", () => {
    test("EXPECT storage to be assigned", () => {
        const item = new Item("Test Item", 10);
        const storage = {} as any;

        item.SetStorageBin(storage);

        expect(item.Storage).toBe(storage);
    });
});