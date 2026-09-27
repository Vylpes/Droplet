import { OrderStatus } from "../constants/Status/OrderStatus";
import { Order } from "../database/entities/Order";
import { BaseDto, mapBase } from "./BaseDto";
import { ListingDto, mapListing } from "./ListingDto";
import { PostagePolicyDto, mapPostagePolicy } from "./PostagePolicyDto";
import { SupplyDto, mapSupply } from "./SupplyDto";
import { TrackingNumberDto, mapTrackingNumber } from "./TrackingNumberDto";

export interface OrderDto extends BaseDto {
    OrderNumber: string;
    Price: number;
    OfferAccepted: boolean;
    Status: OrderStatus;
    StatusName: string;
    DispatchBy: Date;
    Buyer: string;
    Listings?: ListingDto[];
    Supplies?: SupplyDto[];
    TrackingNumbers?: TrackingNumberDto[];
    PostagePolicy?: PostagePolicyDto | null;
}

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
