import ConnectionHelper from "../../../helpers/ConnectionHelper";
import Supply from "../../models/Supply/Supply";

export default async function GetOneSupplyById(uuid: string): Promise<Supply> {
    const supplyMaybe = await ConnectionHelper.FindOne<Supply>("supply", { uuid });

    if (!supplyMaybe.IsSuccess) {
        return;
    }

    const supply = supplyMaybe.Value;

    return supply;
}