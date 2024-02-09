describe("constructor", () => {
    test.todo("EXPECT properties to be updated");
});

describe("StatusName", () => {
    test.todo("EXPECT friendly status name to be returned");
});

describe("UpdateBasicDetails", () => {
    test.todo("EXPECT properties to be updated");
});

describe("UpdateStatus", () => {
    test.todo("EXPECT status to be updated");
});

describe("MarkAsPaid", () => {
    test.todo("EXPECT status to be updated");

    test.todo("GIVEN the date is Friday, EXPECT dispatch by to be set to Monday");
});

describe("MarkAsDispatched", () => {
    test.todo("EXPECT status to be updated");
});

describe("MarkAsReturned", () => {
    test.todo("EXPECT status to be updated");
});

describe("AddListingToOrder", () => {
    test.todo("EXPECT listing to be added to order");
});

describe("AddSupplyToOrder", () => {
    test.todo("EXPECT supply to be added to order");
});

describe("AddTrackingNumberToOrder", () => {
    test.todo("EXPECT tracking number to be added");

    test.todo("GIVEN tracking number isn't an order type, EXPECT nothing to happen");
});

describe("AddPostagePolicyToOrder", () => {
    test.todo("EXPECT postage policy to be assigned");
});

describe("RemovePostagePolicy", () => {
    test.todo("EXPECT postage policy to be unassigned");
});

describe("ApplyDiscount", () => {
    test.todo("EXPECT order price to be discounted");

    test.todo("GIVEN amount to discount is more than the order value, EXPECT nothing to happen");
});