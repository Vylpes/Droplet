import { v4 } from "uuid";
import Order from "../../models/Order/Order";
import { OrderStatus } from "../../../constants/Status/OrderStatus";
import ConnectionHelper from "../../../helpers/ConnectionHelper";

export default async function CreateNewOrderCommand(orderNumber: string, price: number, offerAccepted: boolean, buyer: string, postagePolicyName: string, costToBuyer: number, actualCost: number) {
    const order: Order = {
        uuid: v4(),
        orderNumber,
        price,
        offerAccepted,
        status: OrderStatus.AwaitingPayment,
        dispatchBy: new Date(),
        buyer,
        trackingNumbers: [],
        postagePolicy: {
            uuid: v4(),
            name: postagePolicyName,
            costToBuyer,
            actualCost,
        },
        notes: [],
        r_listings: [],
        r_supplies: [],
    };

    await ConnectionHelper.InsertOne<Order>("order", order);
}