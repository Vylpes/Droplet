import { SupplyStatus } from "../../../constants/Status/SupplyStatus";
import { INote } from "./INote";

export default interface ISupply {
    uuid: string,
    sku: string;
    name: string;
    quantities: {
        unused: number,
        used: number,
    },
    status: SupplyStatus,
    notes: INote[],
}

export function CalculateStatus(supply: ISupply): SupplyStatus {
    if (supply.quantities.unused == 0) {
        return SupplyStatus.Used;
    }

    return SupplyStatus.Unused;
}