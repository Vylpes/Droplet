import ConnectionHelper from "../../../helpers/ConnectionHelper";
import Listing from "../../models/Listing/Listing";
import Order from "../../models/Order/Order";

export default async function AssignListingToOrderCommand(orderId: string, listingId: string) {
    const orderMaybe = await ConnectionHelper.FindOne<Order>("order", { uuid: orderId });
    const listingMaybe = await ConnectionHelper.FindOne<Listing>("listing", { uuid: listingId });

    if (!orderMaybe || !listingMaybe) {
        return;
    }

    await ConnectionHelper.UpdateOne<Order>("order", { uuid: orderId }, { $push: { r_listings: listingId } });
}