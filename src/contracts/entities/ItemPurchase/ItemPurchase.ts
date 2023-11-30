import { ItemPurchaseStatus } from "../../../constants/Status/ItemPurchaseStatus";
import Item from "./Item";
import { Note } from "./Note";

export default interface ItemPurchase {
    uuid: string,
    description: string;
    status: ItemPurchaseStatus
    price: number,
    items: Item[],
    notes: Note[],
}