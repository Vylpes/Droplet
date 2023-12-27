import ConnectionHelper from "../../../helpers/ConnectionHelper";
import Listing from "../../models/Listing/Listing";
import PostagePolicy from "../../models/PostagePolicy/PostagePolicy";

export default async function AssignPostagePolicyToListingCommand(listingId: string, postagePolicyId: string) {
    const listingMaybe = await ConnectionHelper.FindOne<Listing>("listing", { uuid: listingId });
    const postagePolicyMaybe = await ConnectionHelper.FindOne<PostagePolicy>("postage-policy", { uuid: postagePolicyId });

    if (!listingMaybe.IsSuccess || !postagePolicyMaybe.IsSuccess) {
        return;
    }

    const postagePolicy = postagePolicyMaybe.Value;

    await ConnectionHelper.UpdateOne<Listing>("listing", { uuid: listingId }, { $set: { postagePolicy: { uuid: postagePolicyId, name: postagePolicy.name, costToBuyer: postagePolicy.costToBuyer, actualCost: postagePolicy.actualCost } } });
}