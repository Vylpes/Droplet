import ConnectionHelper from "../../../helpers/ConnectionHelper";
import Item from "../../models/Item/Item";
import Listing from "../../models/Listing/Listing";

export default async function GetAllItemsAssignedByListingId(listingId: string): Promise<Item[]> {
    const listingMaybe = await ConnectionHelper.FindOne<Listing>("listing", { uuid: listingId });

    if (!listingMaybe.IsSuccess) {
        return;
    }

    const listing = listingMaybe.Value;

    const items = await ConnectionHelper.FindMultiple<Item>("item", { uuid: { $in: listing.r_items } });

    if (!items.IsSuccess) {
        return;
    }

    return items.Value;
}