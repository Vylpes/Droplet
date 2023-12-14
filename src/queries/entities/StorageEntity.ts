import { StorageType } from "../../constants/StorageType";

export default interface StorageEntity {
    uuid: string,
    name: string,
    skuPrefix: string,
    storageType: StorageType,
    units: {
        uuid: string,
        name: string,
        skuPrefix: string,
        bins: {
            uuid: string,
            name: string,
            skuPrefix: string,
            itemCounter: number,
        }[],
    }[],
}