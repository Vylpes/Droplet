import { OrderStatus } from "../../../constants/Status/OrderStatus";
import { Note } from "./Note";
import { PostagePolicy } from "./PostagePolicy";
import { TrackingNumber } from "./TrackingNumber";

export default interface Order {
    uuid: string,
    orderNumber: string,
    price: number,
    offerAccepted: boolean,
    status: OrderStatus,
    dispatchBy: Date,
    buyer: string,
    trackingNumbers: TrackingNumber[],
    postagePolicy: PostagePolicy,
    notes: Note[],
    r_listings: string[],
    r_supplies: string[],
}