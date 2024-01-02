import { v4 } from "uuid";
import SupplyPurchase from "../../models/SupplyPurchase/SupplyPurchase";
import { SupplyPurchaseStatus } from "../../../constants/Status/SupplyPurchaseStatus";
import ConnectionHelper from "../../../helpers/ConnectionHelper";

export default async function CreateSupplyPurchaseCommand(description: string, price: number): Promise<SupplyPurchase> {
    const supplyPurchase: SupplyPurchase = {
        uuid: v4(),
        description,
        status: SupplyPurchaseStatus.Ordered,
        price,
        notes: [],
        r_supplies: [],
    };

    await ConnectionHelper.InsertOne<SupplyPurchase>("supply-purchase", supplyPurchase);

    return supplyPurchase;
}