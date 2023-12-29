import ConnectionHelper from "../../../helpers/ConnectionHelper";
import Return from "../../models/Return/Return";

export default async function UpdateReturnBasicDetailsCommand(uuid: string, returnNumber: string, returnBy: Date) {
    const returnMaybe = await ConnectionHelper.FindOne<Return>("return", { uuid });

    if (!returnMaybe.IsSuccess) {
        return;
    }

    await ConnectionHelper.UpdateOne<Return>("return", { uuid }, { $set: { returnNumber, returnBy } });
}