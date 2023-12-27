import ConnectionHelper from "../../../helpers/ConnectionHelper";
import Listing from "../../models/Listing/Listing";

export default async function RenewListingCommand(listingId: string, endDate: Date) {
    const listingMaybe = await ConnectionHelper.FindOne<Listing>("listing", { uuid: listingId });

    if (!listingMaybe.IsSuccess) {
        return;
    }

    const listing = listingMaybe.Value;

    await ConnectionHelper.UpdateOne<Listing>("listing", { uuid: listingId }, { $set: { timesRelisted: listing.timesRelisted + 1, endDate } });
}