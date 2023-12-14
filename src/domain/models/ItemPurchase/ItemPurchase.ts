import { ItemPurchaseStatus } from "../../../constants/Status/ItemPurchaseStatus";
import { Note } from "./Note";

export default interface ItemPurchase {
    uuid: string,
    description: string;
    status: ItemPurchaseStatus
    price: number,
    notes: Note[],
    r_items: string[],
}