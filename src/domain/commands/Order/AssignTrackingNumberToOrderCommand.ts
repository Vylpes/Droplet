import { v4 } from "uuid";
import { PostalService } from "../../../constants/PostalService";
import ConnectionHelper from "../../../helpers/ConnectionHelper";
import Order from "../../models/Order/Order";
import { TrackingNumber } from "../../models/Order/TrackingNumber";

export default async function AssignTrackingNumberToOrderCommand(orderId: string, number: string, service: PostalService) {
    const orderMaybe = await ConnectionHelper.FindOne<Order>("order", { uuid: orderId });

    if (!orderMaybe.IsSuccess) {
        return;
    }

    const trackingNumber: TrackingNumber = {
        uuid: v4(),
        number,
        service,
    };

    await ConnectionHelper.UpdateOne<Order>("order", { uuid: orderId }, { $push: { trackingNumbers: trackingNumber } });
}