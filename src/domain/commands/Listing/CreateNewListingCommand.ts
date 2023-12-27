import { v4 } from "uuid";
import Listing from "../../models/Listing/Listing";
import { ListingStatus } from "../../../constants/Status/ListingStatus";
import ConnectionHelper from "../../../helpers/ConnectionHelper";

export default async function CreateNewListingCommand(name: string, listingNumber: string, price: number, endDate: Date, quantity: number, itemId: string) {
    const listing: Listing = {
        uuid: v4(),
        name,
        listingNumber,
        price,
        endDate,
        quantities: {
            left: quantity,
            sold: 0,
        },
        status: ListingStatus.Active,
        timesRelisted: 0,
        postagePolicy: null,
        notes: [],
        r_items: [ itemId ],
    };

    await ConnectionHelper.InsertOne<Listing>("listing", listing);
}