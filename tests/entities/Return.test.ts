import { ReturnStatus } from "../../src/constants/Status/ReturnStatus";
import { Return } from "../../src/database/entities/Return";

describe("Return domain methods", () => {
    it("walks the return lifecycle", () => {
        const ret = new Return("R-1", "RMA-1");
        const returnBy = new Date("2024-06-01");

        ret.MarkAsStarted(returnBy);
        expect(ret.Status).toBe(ReturnStatus.Started);
        expect(ret.ReturnBy).toBe(returnBy);

        ret.MarkAsPosted();
        expect(ret.Status).toBe(ReturnStatus.ItemPosted);

        const receivedBy = new Date("2024-06-10");
        ret.MarkAsReceived(receivedBy);
        expect(ret.Status).toBe(ReturnStatus.ItemReceived);
        expect(ret.ReturnBy).toBe(receivedBy);

        ret.MarkAsRefunded(12.5);
        expect(ret.Status).toBe(ReturnStatus.Refunded);
        expect(ret.RefundAmount).toBe(12.5);

        ret.MarkAsClosed();
        expect(ret.Status).toBe(ReturnStatus.Closed);
    });
});
