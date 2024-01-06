import { ItemPurchaseStatus } from "../../../constants/Status/ItemPurchaseStatus";
import { ItemStatus } from "../../../constants/Status/ItemStatus";
import Item from "../Item/Item";
import { Note } from "./Note";

export default interface ItemPurchase {
    uuid: string,
    description: string;
    status: ItemPurchaseStatus
    price: number,
    notes: Note[],
    r_items: string[],
}