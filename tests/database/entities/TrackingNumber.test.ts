import { PostalService, PostalServiceNames } from "../../../src/constants/PostalService";
import { TrackingNumberType } from "../../../src/constants/TrackingNumberType";
import { TrackingNumber } from "../../../src/database/entities/TrackingNumber";

let trackingNumber: TrackingNumber;

beforeEach(() => {
    trackingNumber = new TrackingNumber("1234567890", PostalService.Hermes, TrackingNumberType.Order);
});

describe("constructor", () => {
    test("EXPECT properties to be set", () => {
        expect(trackingNumber.Number).toBe("1234567890");
        expect(trackingNumber.Service).toBe(PostalService.Hermes);
        expect(trackingNumber.Type).toBe(TrackingNumberType.Order);
    });
});

describe("ServiceName", () => {
    test("EXPECT friendly name to be returned", () => {
        PostalServiceNames.get = jest.fn().mockReturnValue("Hermes")

        expect(trackingNumber.ServiceName()).toBe("Hermes");
        expect(PostalServiceNames.get).toBeCalledWith(PostalService.Hermes);
    });
});

describe("EditBasicDetails", () => {
    test("EXPECT properties to be updated", () => {
        trackingNumber.EditBasicDetails("0987654321", PostalService.RoyalMail);

        expect(trackingNumber.Number).toBe("0987654321");
        expect(trackingNumber.Service).toBe(PostalService.RoyalMail);
    });
});