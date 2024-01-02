import { SupplyPurchaseStatus } from "../../../constants/Status/SupplyPurchaseStatus";
import ConnectionHelper from "../../../helpers/ConnectionHelper";
import SupplyPurchase from "../../models/SupplyPurchase/SupplyPurchase";

export default async function GetAllSupplyPurchasesByStatus(status: SupplyPurchaseStatus): Promise<SupplyPurchase[]> {
    const supplyPurchasesMaybe = await ConnectionHelper.FindMultiple<SupplyPurchase>("supply-purchase", { status });

    if (!supplyPurchasesMaybe.IsSuccess) {
        return;
    }

    const supplyPurchases = supplyPurchasesMaybe.Value;

    return supplyPurchases;
}