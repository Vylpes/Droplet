import { ListingStatus } from "../../../constants/Status/ListingStatus";
import ConnectionHelper from "../../../helpers/ConnectionHelper";
import Item from "../../models/Item/Item";
import Listing from "../../models/Listing/Listing";
import GetAllItemsAssignedByListingId from "../../queries/Item/GetAllItemsAssignedByListingId";

export default async function EndListingCommand(listingId: string) {
    const listingMaybe = await ConnectionHelper.FindOne<Listing>("listing", { uuid: listingId });

    if (!listingMaybe.IsSuccess) {
        return;
    }

    const listing = listingMaybe.Value;
    const items = await GetAllItemsAssignedByListingId(listingId);

    for (let item of items) {
        await ConnectionHelper.UpdateOne<Item>("item", { uuid: item.uuid }, { $set: { quantities: { unlisted: item.quantities.unlisted += listing.quantities.left, listed: item.quantities.listed -= listing.quantities.left, sold: item.quantities.sold, rejected: item.quantities.rejected } } });
    }

    await ConnectionHelper.UpdateOne<Listing>("listing", { uuid: listingId }, { status: ListingStatus.Unsold });
}