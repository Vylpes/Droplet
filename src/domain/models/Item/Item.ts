import { ItemStatus } from "../../../constants/Status/ItemStatus";
import { Note } from "./Note";

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