import { INote } from "./INote";

export default interface PostagePolicy {
    uuid: string,
    name: string,
    costToBuyer: number,
    actualCost: number,
    archived: boolean,
    notes: INote[],
}