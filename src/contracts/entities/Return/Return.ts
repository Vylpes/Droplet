import { ReturnStatus } from "../../../constants/Status/ReturnStatus";
import { INote } from "./INote";
import { ITrackingNumber } from "./ITrackingNumber";

export default interface Return {
    uuid: string,
    returnNumber: string,
    rma: string,
    returnBy: Date,
    status: ReturnStatus,
    refundAmount: number,
    trackingNumbers: ITrackingNumber[],
    notes: INote[],
    r_order: string,
}