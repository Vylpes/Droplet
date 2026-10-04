import type { ReturnDto } from "@droplet/shared";
import { Return } from "../database/entities/Return";
import { mapBase } from "./BaseDto";
import { mapOrder } from "./OrderDto";
import { mapTrackingNumber } from "./TrackingNumberDto";

export type { ReturnDto } from "@droplet/shared";

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
