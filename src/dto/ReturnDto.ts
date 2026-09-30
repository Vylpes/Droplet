import { ReturnStatus } from "../constants/Status/ReturnStatus";
import { Return } from "../database/entities/Return";
import { BaseDto, mapBase } from "./BaseDto";
import { OrderDto, mapOrder } from "./OrderDto";
import { TrackingNumberDto, mapTrackingNumber } from "./TrackingNumberDto";

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

export function mapReturn(ret: Return, includeRelations: boolean = false): ReturnDto {
    const dto: ReturnDto = {
        ...mapBase(ret),
        ReturnNumber: ret.ReturnNumber,
        RMA: ret.RMA,
        ReturnBy: ret.ReturnBy,
        Status: ret.Status,
        StatusName: ret.StatusName() || "",
        RefundAmount: Number(ret.RefundAmount)
    };

    if (includeRelations) {
        if (ret.Order) {
            dto.Order = mapOrder(ret.Order);
        }
        if (ret.TrackingNumbers) {
            dto.TrackingNumbers = ret.TrackingNumbers.map(mapTrackingNumber);
        }
    }

    return dto;
}
