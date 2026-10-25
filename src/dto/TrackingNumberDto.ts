import type { TrackingNumberDto } from "@droplet/shared";
import { TrackingNumber } from "../database/entities/TrackingNumber";
import { mapBase } from "./BaseDto";

export type { TrackingNumberDto } from "@droplet/shared";

export function mapTrackingNumber(tracking: TrackingNumber): TrackingNumberDto {
    return {
        ...mapBase(tracking),
        Number: tracking.Number,
        Service: tracking.Service,
        ServiceName: tracking.ServiceName() || "",
        Type: tracking.Type
    };
}
