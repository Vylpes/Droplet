import IBin from "./IBin";

export default interface IUnit {
    uuid: string,
    name: string,
    skuPrefix: string,
    bins: IBin[],
}