import { OrderStatus } from "../../../constants/Status/OrderStatus";
import { INote } from "./INote";
import { IPostagePolicy } from "./IPostagePolicy";
import { ITrackingNumber } from "./ITrackingNumber";

export default interface Order {
    uuid: string,
    orderNumber: string,
    price: number,
    offerAccepted: boolean,
    status: OrderStatus,
    dispatchBy: Date,
    Buyer: string,
    trackingNumbers: ITrackingNumber[],
    postagePolicy: IPostagePolicy,
    notes: INote,
    r_listings: string[],
    r_supplies: string[],
}