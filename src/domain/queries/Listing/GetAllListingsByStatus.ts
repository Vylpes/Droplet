import { ListingStatus } from "../../../constants/Status/ListingStatus";
import ConnectionHelper from "../../../helpers/ConnectionHelper";
import Listing from "../../models/Listing/Listing";

export default async function GetAllListingsByStatus(status: ListingStatus): Promise<Listing[]> {
    const listings = await ConnectionHelper.FindMultiple<Listing>("listing", { status });

    if (!listings.IsSuccess) {
        return;
    }

    return listings.Value;
}