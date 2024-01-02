import ConnectionHelper from "../../../helpers/ConnectionHelper";
import Supply from "../../models/Supply/Supply";
import SupplyPurchase from "../../models/SupplyPurchase/SupplyPurchase";

export default async function AssignSupplyToPurchaseCommand(supplyId: string, purchaseId: string) {
    const supplyMaybe = await ConnectionHelper.FindOne<Supply>("supply", { uuid: supplyId });
    const purchaseMaybe = await ConnectionHelper.FindOne<SupplyPurchase>("supply-purchase", { uuid: purchaseId });

    if (!supplyMaybe.Value || !purchaseMaybe.Value) {
        return;
    }

    await ConnectionHelper.UpdateOne<SupplyPurchase>("supply-purchase", { uuid: purchaseId }, { $push: { r_supplies: supplyId } });
}