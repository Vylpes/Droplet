import { v4 } from "uuid";
import { StorageType } from "../../../constants/StorageType";
import ConnectionHelper from "../../../helpers/ConnectionHelper";
import Storage from "../../models/Storage/Storage";

export default async function CreateStorageBuildingCommand(name: string, skuPrefix: string): Promise<Storage> {
    const building: Storage = {
        uuid: v4(),
        name,
        skuPrefix,
        storageType: StorageType.Building,
        itemCounter: 0,
        r_children: [],
    };

    await ConnectionHelper.InsertOne<Storage>("storage", building);

    return building;
}