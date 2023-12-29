import { ReturnStatus } from "../../../constants/Status/ReturnStatus";
import ConnectionHelper from "../../../helpers/ConnectionHelper";
import Return from "../../models/Return/Return";

export default async function MarkReturnAsStartedCommand(uuid: string, returnBy: Date) {
    const returnMaybe = await ConnectionHelper.FindOne<Return>("return", { uuid });

    if (!returnMaybe.IsSuccess) {
        return;
    }

    await ConnectionHelper.UpdateOne<Return>("return", { uuid }, { $set: { status: ReturnStatus.Started, returnBy } });
}