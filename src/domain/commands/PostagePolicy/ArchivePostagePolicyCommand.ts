import ConnectionHelper from "../../../helpers/ConnectionHelper";
import PostagePolicy from "../../models/PostagePolicy/PostagePolicy";

export default async function ArchivePostagePolicyCommand(uuid: string) {
    const postagePolicyMaybe = await ConnectionHelper.FindOne<PostagePolicy>("postage-policy", { uuid });

    if (!postagePolicyMaybe.IsSuccess) {
        return;
    }

    await ConnectionHelper.UpdateOne<PostagePolicy>("postage-policy", { uuid }, { $set: { archived: true } });
}