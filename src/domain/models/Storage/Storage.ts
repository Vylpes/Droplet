import { StorageType } from "../../../constants/StorageType";

export default interface Storage {
    uuid: string,
    name: string,
    skuPrefix: string,
    storageType: StorageType,
    itemCounter: number,
    r_children: string[],
}