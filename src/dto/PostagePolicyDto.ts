import type { PostagePolicyDto } from "@droplet/shared";
import PostagePolicy from "../database/entities/PostagePolicy";
import { mapBase } from "./BaseDto";

export type { PostagePolicyDto } from "@droplet/shared";

export function mapPostagePolicy(policy: PostagePolicy): PostagePolicyDto {
    return {
        ...mapBase(policy),
        Name: policy.Name,
        CostToBuyer: Number(policy.CostToBuyer),
        ActualCost: Number(policy.ActualCost),
        Archived: policy.Archived
    };
}
