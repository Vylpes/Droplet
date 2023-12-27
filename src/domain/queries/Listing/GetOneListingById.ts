import ConnectionHelper from "../../../helpers/ConnectionHelper";
import Listing from "../../models/Listing/Listing";

export default async function GetOneListingById(listingId: string): Promise<Listing> {
    const listingMaybe = await ConnectionHelper.FindOne<Listing>("listing", { uuid: listingId });

    if (!listingMaybe.IsSuccess) {
        return;
    }

    const listing = listingMaybe.Value;

    return listing;
}