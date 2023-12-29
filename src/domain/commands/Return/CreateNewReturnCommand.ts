import { v4 } from "uuid";
import Return from "../../models/Return/Return";
import { ReturnStatus } from "../../../constants/Status/ReturnStatus";
import ConnectionHelper from "../../../helpers/ConnectionHelper";

export default async function CreateNewReturnCommand(returnNumber: string, rma: string, orderId: string): Promise<Return> {
    const ret: Return = {
        uuid: v4(),
        returnNumber,
        rma,
        returnBy: new Date(),
        refundAmount: 0,
        status: ReturnStatus.Opened,
        notes: [],
        trackingNumbers: [],
        r_order: orderId,
    };

    await ConnectionHelper.InsertOne<Return>("return", ret);

    return ret;
}