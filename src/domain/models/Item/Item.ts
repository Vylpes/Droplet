import { v4 } from "uuid";
import { Note } from "./Note";
import { ItemStatus } from "../../../constants/Status/ItemStatus";
import ConnectionHelper from "../../../helpers/ConnectionHelper";

export default interface Item {
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
    notes: Note[],
    r_storageBin: string,
    r_itemPurchase: string,
}

export function CalculateStatus(item: Item): ItemStatus {
    if (item.quantities.unlisted > 0) {
        return ItemStatus.Unlisted;
    } else if (item.quantities.listed > 0) {
        return ItemStatus.Listed;
    } else if (item.quantities.sold > 0) {
        return  ItemStatus.Sold;
    } else if (item.quantities.rejected > 0) {
        return ItemStatus.Rejected;
    }

    return item.status;
}