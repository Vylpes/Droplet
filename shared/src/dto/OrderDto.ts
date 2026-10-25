import { OrderStatus } from "../constants/Status/OrderStatus";
import { BaseDto } from "./BaseDto";
import { ListingDto } from "./ListingDto";
import { PostagePolicyDto } from "./PostagePolicyDto";
import { SupplyDto } from "./SupplyDto";
import { TrackingNumberDto } from "./TrackingNumberDto";

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
