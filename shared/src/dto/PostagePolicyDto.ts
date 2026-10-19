import { BaseDto } from "./BaseDto";
import type { ListingDto } from "./ListingDto";

export interface PostagePolicyDto extends BaseDto {
    Name: string;
    CostToBuyer: number;
    ActualCost: number;
    Archived: boolean;
    Listings?: ListingDto[];
}
