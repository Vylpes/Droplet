import ConnectionHelper from "../../../helpers/ConnectionHelper";
import Supply from "../../models/Supply/Supply";

export default async function UpdateSupplyBasicDetailsCommand(uuid: string, sku: string, name: string) {
    const supplyMaybe = await ConnectionHelper.FindOne<Supply>("supply", { uuid });

    if (!supplyMaybe.IsSuccess) {
        return;
    }

    await ConnectionHelper.UpdateOne<Supply>("supply", { uuid }, { $set: { sku, name } });
}