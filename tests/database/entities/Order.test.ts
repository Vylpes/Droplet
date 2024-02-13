import { PostalService } from "../../../src/constants/PostalService";
import { OrderStatus, OrderStatusNames } from "../../../src/constants/Status/OrderStatus";
import { TrackingNumberType } from "../../../src/constants/TrackingNumberType";
import { Listing } from "../../../src/database/entities/Listing";
import { Order } from "../../../src/database/entities/Order";
import PostagePolicy from "../../../src/database/entities/PostagePolicy";
import { Supply } from "../../../src/database/entities/Supply";
import { TrackingNumber } from "../../../src/database/entities/TrackingNumber";

describe("constructor", () => {
    test("EXPECT properties to be initialized correctly", () => {
        // Arrange
        const orderNumber = "123";
        const offerAccepted = true;
        const buyer = "John Doe";

        // Act
        const order = new Order(orderNumber, offerAccepted, buyer);

        // Assert
        expect(order.OrderNumber).toBe(orderNumber);
        expect(order.OfferAccepted).toBe(offerAccepted);
        expect(order.DispatchBy).toBeInstanceOf(Date);
        expect(order.Buyer).toBe(buyer);
        expect(order.Status).toBe(OrderStatus.AwaitingPayment);
        expect(order.Price).toBe(0);
    });
});

describe("StatusName", () => {
    test("EXPECT friendly status name to be returned", () => {
        // Arrange
        const order = new Order("123", true, "John Doe");
        order.Status = OrderStatus.AwaitingPayment;

        // Act
        const statusName = order.StatusName();

        // Assert
        expect(statusName).toBe(OrderStatusNames.get(OrderStatus.AwaitingPayment));
    });
});

describe("UpdateBasicDetails", () => {
    test("EXPECT properties to be updated", () => {
        // Arrange
        const order = new Order("123", true, "John Doe");
        const newOrderNumber = "456";
        const newOfferAccepted = false;
        const newBuyer = "Jane Smith";

        // Act
        order.UpdateBasicDetails(newOrderNumber, newOfferAccepted, newBuyer);

        // Assert
        expect(order.OrderNumber).toBe(newOrderNumber);
        expect(order.OfferAccepted).toBe(newOfferAccepted);
        expect(order.Buyer).toBe(newBuyer);
        expect(order.WhenUpdated).toBeInstanceOf(Date);
    });
});

describe("UpdateStatus", () => {
    test("EXPECT status to be updated", () => {
        // Arrange
        const order = new Order("123", true, "John Doe");
        const newStatus = OrderStatus.Dispatched;

        // Act
        order.UpdateStatus(newStatus);

        // Assert
        expect(order.Status).toBe(newStatus);
        expect(order.WhenUpdated).toBeInstanceOf(Date);
    });
});

describe("MarkAsPaid", () => {
    test("EXPECT status to be updated", () => {
        // Arrange
        const order = new Order("123", true, "John Doe");

        // Act
        order.MarkAsPaid();

        // Assert
        expect(order.Status).toBe(OrderStatus.AwaitingDispatch);
        expect(order.DispatchBy).toBeInstanceOf(Date);
        expect(order.WhenUpdated).toBeInstanceOf(Date);
    });

    test("GIVEN the date is Friday, EXPECT dispatch by to be set to Monday", () => {
        // Arrange
        const order = new Order("123", true, "John Doe");
        const friday = new Date("2022-01-07"); // A Friday

        // Mock the current date to be a Friday
        jest.spyOn(global, "Date").mockImplementation(() => friday as unknown as Date);

        // Act
        order.MarkAsPaid();

        // Assert
        expect(order.DispatchBy).toEqual(new Date("2022-01-10")); // The following Monday
    });
});

describe("MarkAsDispatched", () => {
    test("EXPECT status to be updated", () => {
        // Arrange
        const order = new Order("123", true, "John Doe");

        // Act
        order.MarkAsDispatched();

        // Assert
        expect(order.Status).toBe(OrderStatus.Dispatched);
    });
});

describe("MarkAsReturned", () => {
    test("EXPECT status to be updated", () => {
        // Arrange
        const order = new Order("123", true, "John Doe");

        // Act
        order.MarkAsReturned();

        // Assert
        expect(order.Status).toBe(OrderStatus.Returned);
    });
});

describe("AddListingToOrder", () => {
    test("EXPECT listing to be added to order", () => {
        // Arrange
        const order = new Order("123", true, "John Doe");
        order.Listings = [];
        const listing = new Listing("name", "listingNumber", 10, new Date(), 1);

        // Act
        order.AddListingToOrder(listing);

        // Assert
        expect(order.Listings).toContain(listing);
        expect(order.Price).toBe(listing.Price);
    });
});

describe("AddSupplyToOrder", () => {
    test("EXPECT supply to be added to order", () => {
        // Arrange
        const order = new Order("123", true, "John Doe");
        order.Supplies = [];
        const supply = new Supply("name", "sku", 1);

        // Act
        order.AddSupplyToOrder(supply);

        // Assert
        expect(order.Supplies).toContain(supply);
    });
});

describe("AddTrackingNumberToOrder", () => {
    test("EXPECT tracking number to be added", () => {
        // Arrange
        const order = new Order("123", true, "John Doe");
        order.TrackingNumbers = [];
        const trackingNumber = new TrackingNumber("number", PostalService.Hermes, TrackingNumberType.Order);

        // Act
        order.AddTrackingNumberToOrder(trackingNumber);

        // Assert
        expect(order.TrackingNumbers).toContain(trackingNumber);
    });

    test("GIVEN tracking number isn't an order type, EXPECT nothing to happen", () => {
        // Arrange
        const order = new Order("123", true, "John Doe");
        order.TrackingNumbers = [];
        const trackingNumber = new TrackingNumber("number", PostalService.Hermes, TrackingNumberType.Return);

        // Act
        order.AddTrackingNumberToOrder(trackingNumber);

        // Assert
        expect(order.TrackingNumbers).not.toContain(trackingNumber);
    });
});

describe("AddPostagePolicyToOrder", () => {
    test("EXPECT postage policy to be assigned", () => {
        // Arrange
        const order = new Order("123", true, "John Doe");
        const policy = new PostagePolicy("name", 10, 10);

        // Act
        order.AddPostagePolicyToOrder(policy);

        // Assert
        expect(order.PostagePolicy).toBe(policy);
    });
});

describe("RemovePostagePolicy", () => {
    test("EXPECT postage policy to be unassigned", () => {
        // Arrange
        const order = new Order("123", true, "John Doe");
        const policy = new PostagePolicy("name", 10, 10);
        order.PostagePolicy = policy;

        // Act
        order.RemovePostagePolicy();

        // Assert
        expect(order.PostagePolicy).toBeNull();
    });
});

describe("ApplyDiscount", () => {
    test("EXPECT order price to be discounted", () => {
        // Arrange
        const order = new Order("123", true, "John Doe");
        order.Price = 100;
        const discountAmount = 20;

        // Act
        order.ApplyDiscount(discountAmount);

        // Assert
        expect(order.Price).toBe(80);
    });

    test("GIVEN amount to discount is more than the order value, EXPECT nothing to happen", () => {
        // Arrange
        const order = new Order("123", true, "John Doe");
        order.Price = 100;
        const discountAmount = 150;

        // Act
        order.ApplyDiscount(discountAmount);

        // Assert
        expect(order.Price).toBe(100);
    });
});