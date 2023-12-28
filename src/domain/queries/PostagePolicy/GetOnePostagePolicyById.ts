import ConnectionHelper from "../../../helpers/ConnectionHelper";
import PostagePolicy from "../../models/PostagePolicy/PostagePolicy";

export default async function GetOnePostagePolicyById(uuid: string): Promise<PostagePolicy> {
    const postagePolicyMaybe = await ConnectionHelper.FindOne<PostagePolicy>("postage-policy", { uuid });

    if (!postagePolicyMaybe.IsSuccess) {
        return;
    }

    const postagePolicy = postagePolicyMaybe.Value;

    return postagePolicy;
}