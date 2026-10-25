import type { OrderDto } from "@droplet/shared";
import { Order } from "../database/entities/Order";
import { mapBase } from "./BaseDto";
import { mapListing } from "./ListingDto";
import { mapPostagePolicy } from "./PostagePolicyDto";
import { mapSupply } from "./SupplyDto";
import { mapTrackingNumber } from "./TrackingNumberDto";

export type { OrderDto } from "@droplet/shared";

export function mapOrder(order: Order, includeRelations: boolean = false): OrderDto {
    const dto: OrderDto = {
        ...mapBase(order),
        OrderNumber: order.OrderNumber,
        Price: Number(order.Price),
        OfferAccepted: order.OfferAccepted,
        Status: order.Status,
        StatusName: order.StatusName() || "",
        DispatchBy: order.DispatchBy,
        Buyer: order.Buyer,
        PostagePolicy: order.PostagePolicy ? mapPostagePolicy(order.PostagePolicy) : null
    };

    if (includeRelations) {
        if (order.Listings) {
            dto.Listings = order.Listings.map(l => mapListing(l));
        }
        if (order.Supplies) {
            dto.Supplies = order.Supplies.map(mapSupply);
        }
        if (order.TrackingNumbers) {
            dto.TrackingNumbers = order.TrackingNumbers.map(mapTrackingNumber);
        }
    }

    return dto;
}
