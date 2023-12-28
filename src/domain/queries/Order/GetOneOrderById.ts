import ConnectionHelper from "../../../helpers/ConnectionHelper";
import Order from "../../models/Order/Order";

export default async function GetOneOrderById(uuid: string): Promise<Order> {
    const orderMaybe = await ConnectionHelper.FindOne<Order>("order", { uuid });

    if (!orderMaybe.IsSuccess) {
        return;
    }

    const order = orderMaybe.Value;

    return order;
}