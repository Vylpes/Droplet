import { OrderStatus } from "../../../constants/Status/OrderStatus";
import ConnectionHelper from "../../../helpers/ConnectionHelper";
import Order from "../../models/Order/Order";

export default async function UpdateOrderStatusCommand(orderId: string, status: OrderStatus) {
    const orderMaybe = await ConnectionHelper.FindOne<Order>("order", { uuid: orderId });

    if (!orderMaybe.IsSuccess) {
        return;
    }

    await ConnectionHelper.UpdateOne<Order>("order", { uuid: orderId }, { $set: { status } });
}