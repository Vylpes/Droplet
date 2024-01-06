import ConnectionHelper from "../../../helpers/ConnectionHelper";
import Supply from "../../models/Supply/Supply";
import SupplyPurchase from "../../models/SupplyPurchase/SupplyPurchase";

export default async function GetAllSuppliesByPurchaseId(uuid: string): Promise<Supply[]> {
    const supplyPurchaseMaybe = await ConnectionHelper.FindOne<SupplyPurchase>("supply-purchase", { uuid });

    if (!supplyPurchaseMaybe.IsSuccess) {
        return;
    }

    const supplyPurchase = supplyPurchaseMaybe.Value;

    if (!supplyPurchase.r_supplies) {
        return;
    }

    const suppliesMaybe = await ConnectionHelper.FindMultiple<Supply>("supply", { uuid: { $in: supplyPurchase.r_supplies } });

    if (!suppliesMaybe.IsSuccess) {
        return;
    }

    const supplies = suppliesMaybe.Value;

    return supplies;
}