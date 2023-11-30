import { ListingStatus } from "../../../constants/Status/ListingStatus";
import { Note } from "./Note";
import { PostagePolicy } from "./PostagePolicy";

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
    postagePolicy: PostagePolicy,
    notes: Note[],
    r_items: number[],
}