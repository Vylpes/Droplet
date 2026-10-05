import { ReturnStatus } from "../constants/Status/ReturnStatus";
import { BaseDto } from "./BaseDto";
import { OrderDto } from "./OrderDto";
import { TrackingNumberDto } from "./TrackingNumberDto";

export interface ReturnDto extends BaseDto {
    ReturnNumber: string;
    RMA: string;
    ReturnBy: Date;
    Status: ReturnStatus;
    StatusName: string;
    RefundAmount: number;
    Order?: OrderDto | null;
    TrackingNumbers?: TrackingNumberDto[];
}
