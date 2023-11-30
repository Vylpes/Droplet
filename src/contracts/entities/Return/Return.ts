import { ReturnStatus } from "../../../constants/Status/ReturnStatus";
import { Note } from "./Note";
import { TrackingNumber } from "./TrackingNumber";

export default interface Return {
    uuid: string,
    returnNumber: string,
    rma: string,
    returnBy: Date,
    status: ReturnStatus,
    refundAmount: number,
    trackingNumbers: TrackingNumber[],
    notes: Note[],
    r_order: string,
}