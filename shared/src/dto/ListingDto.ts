import { ListingStatus } from "../constants/Status/ListingStatus";
import { BaseDto } from "./BaseDto";
import { ItemDto } from "./ItemDto";
import { PostagePolicyDto } from "./PostagePolicyDto";

export interface ListingDto extends BaseDto {
    Name: string;
    ListingNumber: string;
    Price: number;
    Status: ListingStatus;
    StatusName: string;
    EndDate: Date;
    RelistedTimes: number;
    Quantity: number;
    OriginalQuantity: number;
    Items?: ItemDto[];
    PostagePolicy?: PostagePolicyDto | null;
}
