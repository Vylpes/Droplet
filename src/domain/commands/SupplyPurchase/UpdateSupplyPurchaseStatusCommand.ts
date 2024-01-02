import { SupplyPurchaseStatus } from "../../../constants/Status/SupplyPurchaseStatus";
import ConnectionHelper from "../../../helpers/ConnectionHelper";
import SupplyPurchase from "../../models/SupplyPurchase/SupplyPurchase";

export default async function UpdateSupplyPurchaseStatusCommand(uuid: string, status: SupplyPurchaseStatus) {
    const supplyPurchaseMaybe = await ConnectionHelper.FindOne<SupplyPurchase>("supply-purchase", { uuid });

    if (!supplyPurchaseMaybe.IsSuccess) {
        return;
    }

    await ConnectionHelper.UpdateOne<SupplyPurchase>("supply-purchase", { uuid }, { $set: { status } });
}