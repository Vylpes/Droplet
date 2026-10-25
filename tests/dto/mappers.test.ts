import { ItemStatus } from "../../src/constants/Status/ItemStatus";
import { OrderStatus } from "../../src/constants/Status/OrderStatus";
import { PostalService } from "../../src/constants/PostalService";
import { StorageType } from "../../src/constants/StorageType";
import { TrackingNumberType } from "../../src/constants/TrackingNumberType";
import { Item } from "../../src/database/entities/Item";
import { Order } from "../../src/database/entities/Order";
import { Storage } from "../../src/database/entities/Storage";
import { TrackingNumber } from "../../src/database/entities/TrackingNumber";
import { User } from "../../src/database/entities/User";
import { ItemStatusNames } from "../../src/constants/Status/ItemStatus";
import { OrderStatusNames } from "../../src/constants/Status/OrderStatus";
import { PostalServiceNames } from "../../src/constants/PostalService";
import { StorageTypeNames } from "../../src/constants/StorageType";
import { mapItem, mapOrder, mapStorage, mapTrackingNumber, mapUser } from "../../src/dto";

function baseFields() {
    return {
        Id: "test-id",
        WhenCreated: new Date("2024-01-01"),
        WhenUpdated: new Date("2024-01-02")
    };
}

describe("DTO mappers", () => {
    describe("mapItem", () => {
        it("includes StatusName as a plain string that survives JSON.stringify", () => {
            const item = {
                ...baseFields(),
                Name: "Widget",
                Sku: "SKU-1",
                UnlistedQuantity: 5,
                ListedQuantity: 0,
                SoldQuantity: 0,
                RejectedQuantity: 0,
                Status: ItemStatus.Listed,
                StatusName: () => ItemStatusNames.get(ItemStatus.Listed),
                BuyPrice: 10
            } as Item;

            const dto = mapItem(item);
            const serialized = JSON.parse(JSON.stringify(dto));

            expect(dto.Status).toBe(ItemStatus.Listed);
            expect(dto.StatusName).toBe("Listed");
            expect(serialized.StatusName).toBe("Listed");
            expect(serialized.Name).toBe("Widget");
        });
    });

    describe("mapOrder", () => {
        it("includes StatusName as a plain string that survives JSON.stringify", () => {
            const order = {
                ...baseFields(),
                OrderNumber: "ORD-1",
                Price: 20,
                OfferAccepted: true,
                Status: OrderStatus.AwaitingDispatch,
                StatusName: () => OrderStatusNames.get(OrderStatus.AwaitingDispatch),
                DispatchBy: new Date(),
                Buyer: "Buyer"
            } as Order;

            const dto = mapOrder(order);
            const serialized = JSON.parse(JSON.stringify(dto));

            expect(serialized.StatusName).toBe("Awaiting Dispatch");
            expect(serialized.OrderNumber).toBe("ORD-1");
        });
    });

    describe("mapUser", () => {
        it("omits Password from the DTO", () => {
            const user = {
                ...baseFields(),
                Email: "a@b.com",
                Username: "alice",
                Password: "secret-hash",
                Verified: true,
                Admin: false,
                Active: true
            } as User;

            const dto = mapUser(user);
            const serialized = JSON.parse(JSON.stringify(dto));

            expect(serialized.Email).toBe("a@b.com");
            expect(serialized.Username).toBe("alice");
            expect(serialized.Password).toBeUndefined();
            expect("Password" in dto).toBe(false);
        });
    });

    describe("mapTrackingNumber", () => {
        it("includes ServiceName as a plain string that survives JSON.stringify", () => {
            const tracking = {
                ...baseFields(),
                Number: "AB123",
                Service: PostalService.RoyalMail,
                ServiceName: () => PostalServiceNames.get(PostalService.RoyalMail),
                Type: TrackingNumberType.Order
            } as TrackingNumber;

            const dto = mapTrackingNumber(tracking);
            const serialized = JSON.parse(JSON.stringify(dto));

            expect(dto.ServiceName).toBe("Royal Mail");
            expect(serialized.ServiceName).toBe("Royal Mail");
        });
    });

    describe("mapStorage", () => {
        it("includes StorageTypeName as a plain string that survives JSON.stringify", () => {
            const storage = {
                ...baseFields(),
                Name: "Building A",
                SkuPrefix: "BA",
                StorageType: StorageType.Building,
                StorageTypeName: () => StorageTypeNames.get(StorageType.Building),
                ItemCounter: 0
            } as Storage;

            const dto = mapStorage(storage);
            const serialized = JSON.parse(JSON.stringify(dto));

            expect(dto.StorageTypeName).toBe("Building");
            expect(serialized.StorageTypeName).toBe("Building");
        });
    });
});
