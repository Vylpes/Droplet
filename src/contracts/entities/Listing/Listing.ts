import { ListingStatus } from "../../../constants/Status/ListingStatus";
import { INote } from "./INote";
import { IPostagePolicy } from "./IPostagePolicy";

export default interface Listing {
    uuid: string,
    name: string,
    listingNumber: string,
    price: number,
    status: ListingStatus,
    endDate: Date,
    timesRelisted: number,
    quantities: {
        left: number,
        sold: number,
    },
    postagePolicy: IPostagePolicy,
    notes: INote[],
    r_items: number[],
}