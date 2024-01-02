import ConnectionHelper from "../../../helpers/ConnectionHelper";
import Supply from "../../models/Supply/Supply";

export default async function UpdateSupplyQuantityCommand(uuid: string, unused: number, used: number) {
    const supplyMaybe = await ConnectionHelper.FindOne<Supply>("supply", { uuid });

    if (!supplyMaybe.IsSuccess) {
        return;
    }

    await ConnectionHelper.UpdateOne<Supply>("supply", { uuid }, { $set: { quantities: { unused, used } } });
}