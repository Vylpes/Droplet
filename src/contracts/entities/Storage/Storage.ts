import { StorageType } from "../../../constants/StorageType";
import IUnit from "./IUnit";

export default interface Storage {
    uuid: string,
    name: string,
    skuPrefix: string,
    storageType: StorageType,
    units: IUnit[],
}