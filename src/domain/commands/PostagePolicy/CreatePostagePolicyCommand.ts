import { v4 } from "uuid";
import PostagePolicy from "../../models/PostagePolicy/PostagePolicy";
import ConnectionHelper from "../../../helpers/ConnectionHelper";

export default async function CreatePostagePolicyCommand(name: string, costToBuyer: number, actualCost: number) {
    const postagePolicy: PostagePolicy = {
        uuid: v4(),
        name,
        costToBuyer,
        actualCost,
        archived: false,
        notes: [],
    };

    await ConnectionHelper.InsertOne<PostagePolicy>("postage-policy", postagePolicy);
}