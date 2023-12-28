import { SupplyStatus } from "../../../constants/Status/SupplyStatus";
import ConnectionHelper from "../../../helpers/ConnectionHelper";
import Supply from "../../models/Supply/Supply";

export default async function GetAllSuppliesByStatus(status: SupplyStatus): Promise<Supply[]> {
    const suppliesMaybe = await ConnectionHelper.FindMultiple<Supply>("supply", { status });

    if (!suppliesMaybe.IsSuccess) {
        return;
    }

    const supplies = suppliesMaybe.Value;

    return supplies;
}