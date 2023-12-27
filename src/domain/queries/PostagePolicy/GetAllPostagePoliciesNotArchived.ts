import ConnectionHelper from "../../../helpers/ConnectionHelper";
import PostagePolicy from "../../models/PostagePolicy/PostagePolicy";

export default async function GetAllPostagePoliciesNotArchived(): Promise<PostagePolicy[]> {
    const postagePoliciesMaybe = await ConnectionHelper.FindMultiple<PostagePolicy>("postage-policy", { archived: false });

    if (!postagePoliciesMaybe.IsSuccess) {
        return;
    }

    const postagePolicies = postagePoliciesMaybe.Value;

    return postagePolicies;
}