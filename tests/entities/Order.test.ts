import { OrderStatus } from "../../src/constants/Status/OrderStatus";
import { Order } from "../../src/database/entities/Order";
import { Listing } from "../../src/database/entities/Listing";

describe("Order domain methods", () => {
    it("MarkAsPaid moves to awaiting dispatch and sets DispatchBy in the future", () => {
        const order = new Order("ORD-1", false, "buyer");
        const before = Date.now();

        order.MarkAsPaid();

        expect(order.Status).toBe(OrderStatus.AwaitingDispatch);
        expect(order.DispatchBy.getTime()).toBeGreaterThan(before);
    });

    it("MarkAsDispatched sets status and DispatchBy to now", () => {
        const order = new Order("ORD-1", false, "buyer");
        order.MarkAsPaid();

        order.MarkAsDispatched();

        expect(order.Status).toBe(OrderStatus.Dispatched);
        expect(order.DispatchBy).toBeInstanceOf(Date);
    });

    it("MarkAsReturned sets returned status", () => {
        const order = new Order("ORD-1", false, "buyer");
        order.MarkAsReturned();
        expect(order.Status).toBe(OrderStatus.Returned);
    });

    it("ApplyDiscount reduces price but never below zero via overshoot", () => {
        const order = new Order("ORD-1", false, "buyer");
        order.Price = 20;

        order.ApplyDiscount(5);
        expect(order.Price).toBe(15);

        order.ApplyDiscount(100);
        expect(order.Price).toBe(15);
    });

    it("AddListingToOrder appends the listing and increases price", () => {
        const order = new Order("ORD-1", false, "buyer");
        order.Listings = [];
        const listing = new Listing("Widget", "L-1", 12.5, new Date(), 1);

        order.AddListingToOrder(listing);

        expect(order.Listings).toHaveLength(1);
        expect(order.Price).toBe(12.5);
    });
});
