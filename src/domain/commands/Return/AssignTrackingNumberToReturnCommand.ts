import { v4 } from "uuid";
import { PostalService } from "../../../constants/PostalService";
import ConnectionHelper from "../../../helpers/ConnectionHelper";
import Return from "../../models/Return/Return";
import { TrackingNumber } from "../../models/Return/TrackingNumber";

export default async function AssignTrackingNumberToReturnCommand(uuid: string, trackingNum: string, trackingService: PostalService) {
    const returnMaybe = await ConnectionHelper.FindOne<Return>("return", { uuid });

    if (!returnMaybe.IsSuccess) {
        return;
    }

    const trackingNumber: TrackingNumber = {
        uuid: v4(),
        number: trackingNum,
        service: trackingService,
    };

    await ConnectionHelper.UpdateOne<Return>("return", { uuid }, { $push: { trackingNumbers: trackingNumber }});
}