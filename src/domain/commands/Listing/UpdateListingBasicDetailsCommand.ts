import ConnectionHelper from "../../../helpers/ConnectionHelper";
import Listing from "../../models/Listing/Listing";

export default async function UpdateListingBasicDetailsCommand(listingId: string, name: string, listingNumber: string, price: number, quantity: number) {
    const listingMaybe = await ConnectionHelper.FindOne<Listing>("listing", { uuid: listingId });

    if (!listingMaybe.IsSuccess) {
        return;
    }

    const listing = listingMaybe.Value;

    await ConnectionHelper.UpdateOne<Listing>("listing", { uuid: listingId }, { $set: { name, listingNumber, price, quantities: { left: quantity, sold: listing.quantities.sold } } });
}