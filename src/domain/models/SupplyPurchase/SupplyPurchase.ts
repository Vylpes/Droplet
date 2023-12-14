import { SupplyPurchaseStatus } from "../../../constants/Status/SupplyPurchaseStatus";
import { Note } from "./Note";

export default interface SupplyPurchase {
    uuid: string,
    description: string;
    status: SupplyPurchaseStatus
    price: number,
    notes: Note[],
    r_supplies: string[],
}