import ConnectionHelper from "../../../helpers/ConnectionHelper";
import SupplyPurchase from "../../models/SupplyPurchase/SupplyPurchase";

export default async function GetOneSupplyPurchaseById(uuid: string): Promise<SupplyPurchase> {
    const supplyPurchaseMaybe = await ConnectionHelper.FindOne<SupplyPurchase>("supply-purchase", { uuid });

    if (!supplyPurchaseMaybe.IsSuccess) {
        return;
    }

    const supplyPurchase = supplyPurchaseMaybe.Value;

    return supplyPurchase;
}