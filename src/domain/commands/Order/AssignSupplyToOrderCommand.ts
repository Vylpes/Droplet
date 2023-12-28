import ConnectionHelper from "../../../helpers/ConnectionHelper";
import Order from "../../models/Order/Order";
import Supply from "../../models/Supply/Supply";

export default async function AssignSupplyToOrderCommand(orderId: string, supplyId: string) {
    const orderMaybe = await ConnectionHelper.FindOne<Order>("order", { uuid: orderId });
    const supplyMaybe = await ConnectionHelper.FindOne<Supply>("supply", { uuid: supplyId });

    if (!orderMaybe.IsSuccess || !supplyMaybe.IsSuccess) {
        return;
    }

    await ConnectionHelper.UpdateOne<Order>("order", { uuid: orderId }, { $push: { r_supplies: supplyId } });
}