export enum SupplyStatus {
    Unused,
    Used
}

export const SupplyStatusNames = new Map<SupplyStatus, string>([
    [ SupplyStatus.Unused, "Unused" ],
    [ SupplyStatus.Used, "Used" ],
]);