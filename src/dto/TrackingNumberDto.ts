import { PostalService } from "../constants/PostalService";
import { TrackingNumberType } from "../constants/TrackingNumberType";
import { TrackingNumber } from "../database/entities/TrackingNumber";
import { BaseDto, mapBase } from "./BaseDto";

export interface TrackingNumberDto extends BaseDto {
    Number: string;
    Service: PostalService;
    ServiceName: string;
    Type: TrackingNumberType;
}

export function mapTrackingNumber(tracking: TrackingNumber): TrackingNumberDto {
    return {
        ...mapBase(tracking),
        Number: tracking.Number,
        Service: tracking.Service,
        ServiceName: tracking.ServiceName() || "",
        Type: tracking.Type
    };
}
