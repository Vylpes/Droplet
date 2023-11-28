import { ItemPurchaseStatus } from "../../../constants/Status/ItemPurchaseStatus";
import IItem from "./IItem";
import { INote } from "./INote";

export default interface ItemPurchase {
    uuid: string,
    description: string;
    status: ItemPurchaseStatus
    price: number,
    items: IItem[],
    notes: INote[],
}