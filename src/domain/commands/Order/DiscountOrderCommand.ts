import ConnectionHelper from "../../../helpers/ConnectionHelper";
import Order from "../../models/Order/Order";

export default async function DiscountOrderCommand(orderId: string, amount: number) {
    const orderMaybe = await ConnectionHelper.FindOne<Order>("order", { uuid: orderId });

    if (!orderMaybe.IsSuccess) {
        return;
    }

    const order = orderMaybe.Value;

    await ConnectionHelper.UpdateOne<Order>("order", { uuid: orderId }, { $set: { price: order.price - amount } });
}