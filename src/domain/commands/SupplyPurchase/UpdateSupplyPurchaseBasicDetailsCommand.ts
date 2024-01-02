import ConnectionHelper from "../../../helpers/ConnectionHelper";
import SupplyPurchase from "../../models/SupplyPurchase/SupplyPurchase";

export default async function UpdateSupplyPurchaseBasicDetailsCommand(uuid: string, description: string, price: number) {
    const supplyPurchaseMaybe = await ConnectionHelper.FindOne<SupplyPurchase>("supply-purchase", { uuid });

    if (!supplyPurchaseMaybe.IsSuccess) {
        return;
    }

    await ConnectionHelper.UpdateOne<SupplyPurchase>("supply-purchase", { uuid }, { $set: { description, price } });
}