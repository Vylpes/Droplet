import { ListingStatus } from "../constants/Status/ListingStatus";
import { Listing } from "../database/entities/Listing";
import { BaseDto, mapBase } from "./BaseDto";
import { ItemDto, mapItem } from "./ItemDto";
import { PostagePolicyDto, mapPostagePolicy } from "./PostagePolicyDto";

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

export function mapListing(listing: Listing, includeItems: boolean = false): ListingDto {
    const dto: ListingDto = {
        ...mapBase(listing),
        Name: listing.Name,
        ListingNumber: listing.ListingNumber,
        Price: Number(listing.Price),
        Status: listing.Status,
        StatusName: listing.StatusName() || "",
        EndDate: listing.EndDate,
        RelistedTimes: listing.RelistedTimes,
        Quantity: listing.Quantity,
        OriginalQuantity: listing.OriginalQuantity,
        PostagePolicy: listing.PostagePolicy ? mapPostagePolicy(listing.PostagePolicy) : null
    };

    if (includeItems && listing.Items) {
        dto.Items = listing.Items.map(mapItem);
    }

    return dto;
}
