import { StorageType } from "../../../constants/StorageType";
import Unit from "./Unit";

export default interface Storage {
    uuid: string,
    name: string,
    skuPrefix: string,
    storageType: StorageType,
    units: Unit[],
}