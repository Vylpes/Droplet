import { v4 } from "uuid";
import Supply from "../../models/Supply/Supply";
import { SupplyStatus } from "../../../constants/Status/SupplyStatus";
import ConnectionHelper from "../../../helpers/ConnectionHelper";

export default async function CreateSupplyCommand(sku: string, name: string, quantity: number): Promise<Supply> {
    const supply: Supply = {
        uuid: v4(),
        sku,
        name,
        quantities: {
            unused: quantity,
            used: 0,
        },
        status: SupplyStatus.Unused,
        notes: [],
    };

    await ConnectionHelper.InsertOne<Supply>("supply", supply);

    return supply;
}