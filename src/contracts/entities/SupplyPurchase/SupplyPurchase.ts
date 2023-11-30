import { SupplyPurchaseStatus } from "../../../constants/Status/SupplyPurchaseStatus";
import { Note } from "./Note";
import Supply from "./Supply";

export default interface SupplyPurchase {
    uuid: string,
    description: string;
    status: SupplyPurchaseStatus
    price: number,
    supplies: Supply[],
    notes: Note[],
}