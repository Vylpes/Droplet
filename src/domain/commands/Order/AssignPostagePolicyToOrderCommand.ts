import ConnectionHelper from "../../../helpers/ConnectionHelper";
import Order from "../../models/Order/Order";
import PostagePolicy from "../../models/PostagePolicy/PostagePolicy";

export default async function AssignPostagePolicyToOrderCommand(uuid: string, postagePolicyId: string) {
    const orderMaybe = await ConnectionHelper.FindOne<Order>("order", { uuid });
    const postagePolicyMaybe = await ConnectionHelper.FindOne<PostagePolicy>("postage-policy", { uuid: postagePolicyId });

    if (!orderMaybe.IsSuccess || !postagePolicyMaybe.IsSuccess) {
        return;
    }

    const postagePolicy = postagePolicyMaybe.Value;

    await ConnectionHelper.UpdateOne<Order>("order", { uuid }, { $set: { postagePolicy: { uuid: postagePolicyId, name: postagePolicy.name, costToBuyer: postagePolicy.costToBuyer, actualCost: postagePolicy.actualCost } } });
}