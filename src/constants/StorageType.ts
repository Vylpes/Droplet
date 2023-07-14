export enum StorageType {
    Bin,
    Unit,
    Building,
}

export const StorageTypeNames = new Map<StorageType, string>([
    [ StorageType.Bin, "Bin" ],
    [ StorageType.Unit, "Unit" ],
    [ StorageType.Building, "Building" ],
]);