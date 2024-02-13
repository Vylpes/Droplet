import { PostalService } from "../../../src/constants/PostalService";
import { ReturnStatus, ReturnStatusNames } from "../../../src/constants/Status/ReturnStatus";
import { TrackingNumberType } from "../../../src/constants/TrackingNumberType";
import { Order } from "../../../src/database/entities/Order";
import { Return } from "../../../src/database/entities/Return";
import { TrackingNumber } from "../../../src/database/entities/TrackingNumber";
import SettingsHelper from "../../../src/helpers/SettingsHelper";

describe("constructor", () => {
    test("EXPECT properties to be set", () => {
        const returnNumber = "123";
        const rma = "RMA123";

        const returnInstance = new Return(returnNumber, rma);

        expect(returnInstance.ReturnNumber).toBe(returnNumber);
        expect(returnInstance.RMA).toBe(rma);
        expect(returnInstance.Status).toBe(ReturnStatus.Opened);
        expect(returnInstance.ReturnBy).toBeInstanceOf(Date);
        expect(returnInstance.RefundAmount).toBe(0);
    });
});

describe("StatusName", () => {
    test("EXPECT friendly status text to be returned", () => {
        const returnInstance = new Return("123", "RMA123");
        returnInstance.Status = ReturnStatus.Started;

        const statusName = returnInstance.StatusName();

        expect(statusName).toBe(ReturnStatusNames.get(ReturnStatus.Started));
    });
});

describe("UpdateBasicDetails", () => {
    test("EXPECT properties to be updated", () => {
        const returnInstance = new Return("123", "RMA123");
        const returnNumber = "456";
        const rma = "RMA456";
        const returnBy = new Date();

        returnInstance.UpdateBasicDetails(returnNumber, rma, returnBy);

        expect(returnInstance.ReturnNumber).toBe(returnNumber);
        expect(returnInstance.RMA).toBe(rma);
        expect(returnInstance.ReturnBy).toBe(returnBy);
    });
});

describe("AssignOrderToReturn", () => {
    test("EXPECT entity to be assigned", () => {
        const returnInstance = new Return("123", "RMA123");
        const order = new Order("orderNumber", false, "buyer");

        returnInstance.AssignOrderToReturn(order);

        expect(returnInstance.Order).toBe(order);
    });
});

describe("AssignTrackingNumber", () => {
    test("EXPECT entity to be pushed", () => {
        const returnInstance = new Return("123", "RMA123");
        returnInstance.TrackingNumbers = [];
        const trackingNumber = new TrackingNumber("name", PostalService.Hermes, TrackingNumberType.Return);
        trackingNumber.Type = TrackingNumberType.Return;

        returnInstance.AssignTrackingNumber(trackingNumber);

        expect(returnInstance.TrackingNumbers).toContain(trackingNumber);
    });

    test("GIVEN tracking number type is not a return, EXPECT nothing to happen", () => {
        const returnInstance = new Return("123", "RMA123");
        returnInstance.TrackingNumbers = [];
        const trackingNumber = new TrackingNumber("name", PostalService.Hermes, TrackingNumberType.Order);

        returnInstance.AssignTrackingNumber(trackingNumber);

        expect(returnInstance.TrackingNumbers).not.toContain(trackingNumber);
    });
});

describe("MarkAsStarted", () => {
    test("EXPECT properties to be updated", () => {
        const returnInstance = new Return("123", "RMA123");
        const refundBy = new Date();

        returnInstance.MarkAsStarted(refundBy);

        expect(returnInstance.Status).toBe(ReturnStatus.Started);
        expect(returnInstance.ReturnBy).toBe(refundBy);
    });
});

describe("MarkAsPosted", () => {
    test("EXPECT properties to be updated", () => {
        const returnInstance = new Return("123", "RMA123");

        returnInstance.MarkAsPosted();

        expect(returnInstance.Status).toBe(ReturnStatus.ItemPosted);
    });
});

describe("MarkAsReceived", () => {
    test("EXPECT properties to be updated", () => {
        const returnInstance = new Return("123", "RMA123");
        const refundBy = new Date();

        returnInstance.MarkAsReceived(refundBy);

        expect(returnInstance.Status).toBe(ReturnStatus.ItemReceived);
        expect(returnInstance.ReturnBy).toBe(refundBy);
    });
});

describe("MarkAsRefunded", () => {
    test("EXPECT properties to be updated", () => {
        const returnInstance = new Return("123", "RMA123");
        const refundAmount = 100;

        returnInstance.MarkAsRefunded(refundAmount);

        expect(returnInstance.Status).toBe(ReturnStatus.Refunded);
        expect(returnInstance.ReturnBy).toBeInstanceOf(Date);
        expect(returnInstance.RefundAmount).toBe(refundAmount);
    });
});

describe("MarkAsClosed", () => {
    test("EXPECT properties to be updated", () => {
        const returnInstance = new Return("123", "RMA123");

        returnInstance.MarkAsClosed();

        expect(returnInstance.Status).toBe(ReturnStatus.Closed);
        expect(returnInstance.ReturnBy).toBeInstanceOf(Date);
    });
});

describe("GenerateRMA", () => {
    test("EXPECT RMA string to be returned", async () => {
        const count = 10;
        jest.spyOn(SettingsHelper, "GetSetting").mockResolvedValue(String(count));
        jest.spyOn(SettingsHelper, "SetSetting").mockResolvedValue();

        const rma = await Return.GenerateRMA();

        const date = new Date();
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth()).padStart(2, '0');
        const year = String(date.getFullYear()).padStart(4, '0');

        expect(rma).toMatch(new RegExp(`^${year}${month}${day}-\\d{4}$`));
        expect(SettingsHelper.GetSetting).toHaveBeenCalledWith("return.count");
        expect(SettingsHelper.SetSetting).toHaveBeenCalledWith("return.count", String(count + 1));
    });
});