import ConnectionHelper from "../../../helpers/ConnectionHelper";
import Order from "../../models/Order/Order";

export default async function RemovePostagePolicyFromOrderCommand(uuid: string) {
    const orderMaybe = await ConnectionHelper.FindOne<Order>("order", { uuid });

    if (!orderMaybe.IsSuccess) {
        return;
    }

    await ConnectionHelper.UpdateOne<Order>("order", { uuid }, { $unset: { postagePolicy: "" } });
}