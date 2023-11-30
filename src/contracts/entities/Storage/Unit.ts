import Bin from "./Bin";

export default interface Unit {
    uuid: string,
    name: string,
    skuPrefix: string,
    bins: Bin[],
}