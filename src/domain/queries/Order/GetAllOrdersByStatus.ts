import { OrderStatus } from "../../../constants/Status/OrderStatus";
import ConnectionHelper from "../../../helpers/ConnectionHelper";
import Order from "../../models/Order/Order";

export default async function GetAllOrdersByStatus(status: OrderStatus): Promise<Order[]> {
    const ordersMaybe = await ConnectionHelper.FindMultiple<Order>("order", { status });

    if (!ordersMaybe.IsSuccess) {
        return;
    }

    const orders = ordersMaybe.Value;

    return orders;
}