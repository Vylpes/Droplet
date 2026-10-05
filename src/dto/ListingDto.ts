import type { ListingDto } from "@droplet/shared";
import { Listing } from "../database/entities/Listing";
import { mapBase } from "./BaseDto";
import { mapItem } from "./ItemDto";
import { mapPostagePolicy } from "./PostagePolicyDto";

export type { ListingDto } from "@droplet/shared";

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
