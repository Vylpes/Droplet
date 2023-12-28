import ConnectionHelper from "../../../helpers/ConnectionHelper";
import Order from "../../models/Order/Order";

export default async function UpdateOrderBasicDetailsCommand(uuid: string, orderNumber: string, offerAccepted: boolean, buyer: string) {
    const orderMaybe = await ConnectionHelper.FindOne<Order>("order", { uuid });

    if (!orderMaybe.IsSuccess) {
        return;
    }

    await ConnectionHelper.UpdateOne<Order>("order", { uuid }, { $set: { orderNumber, offerAccepted, buyer } });
}