import { ItemPurchaseStatus } from "../../constants/Status/ItemPurchaseStatus";

export default interface ItemPurchaseEntity {
    uuid: string,
    description: string,
    status: ItemPurchaseStatus,
    price: number,
    notes: {
        comment: string,
        whenCreated: Date,
        author: {
            username: string,
        }
    }[],
    r_items: string[],
}