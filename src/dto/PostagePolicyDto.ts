import PostagePolicy from "../database/entities/PostagePolicy";
import { BaseDto, mapBase } from "./BaseDto";

export interface PostagePolicyDto extends BaseDto {
    Name: string;
    CostToBuyer: number;
    ActualCost: number;
    Archived: boolean;
}

export function mapPostagePolicy(policy: PostagePolicy): PostagePolicyDto {
    return {
        ...mapBase(policy),
        Name: policy.Name,
        CostToBuyer: Number(policy.CostToBuyer),
        ActualCost: Number(policy.ActualCost),
        Archived: policy.Archived
    };
}
