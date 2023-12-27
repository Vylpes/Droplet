import ConnectionHelper from "../../../helpers/ConnectionHelper";
import Item from "../../models/Item/Item";
import Listing from "../../models/Listing/Listing";

export default async function AssignItemToListingCommand(listingId: string, itemId: string) {
    const listing = await ConnectionHelper.FindOne<Listing>("listing", { uuid: listingId });
    const item = await ConnectionHelper.FindOne<Item>("item", { uuid: itemId });

    if (!listing || !item) {
        return;
    }

    await ConnectionHelper.UpdateOne<Listing>("listing", { uuid: listingId }, { $push: { r_items: itemId } });
}