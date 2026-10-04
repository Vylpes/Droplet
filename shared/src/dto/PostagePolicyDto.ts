import { BaseDto } from "./BaseDto";

export interface PostagePolicyDto extends BaseDto {
    Name: string;
    CostToBuyer: number;
    ActualCost: number;
    Archived: boolean;
}
