import { ItemStatus } from "../../constants/Status/ItemStatus";

export default interface ItemEntity {
    uuid: string,
    sku: string;
    name: string;
    quantities: {
        unlisted: number;
        listed: number;
        sold: number;
        rejected: number;
    },
    status: ItemStatus,
    notes: {
        comment: string,
        whenCreated: Date,
        author: {
            username: string,
        },
    }[],
    r_storageBin: string,
    r_itemPurchase: string,
}