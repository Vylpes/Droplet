import { SupplyPurchaseStatus } from "../../../constants/Status/SupplyPurchaseStatus";
import { INote } from "./INote";
import ISupply from "./ISupply";

export default interface SupplyPurchase {
    uuid: string,
    description: string;
    status: SupplyPurchaseStatus
    price: number,
    supplies: ISupply[],
    notes: INote[],
}