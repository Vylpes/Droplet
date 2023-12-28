import { SupplyStatus } from "../../../constants/Status/SupplyStatus";
import { Note } from "./Note";

export default interface Supply {
    uuid: string,
    sku: string;
    name: string;
    quantities: {
        unused: number,
        used: number,
    },
    status: SupplyStatus,
    notes: Note[],
}

export function CalculateStatus(supply: Supply): SupplyStatus {
    if (supply.quantities.unused == 0) {
        return SupplyStatus.Used;
    }

    return SupplyStatus.Unused;
}