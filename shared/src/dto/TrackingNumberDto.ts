import { PostalService } from "../constants/PostalService";
import { TrackingNumberType } from "../constants/TrackingNumberType";
import { BaseDto } from "./BaseDto";

export interface TrackingNumberDto extends BaseDto {
    Number: string;
    Service: PostalService;
    ServiceName: string;
    Type: TrackingNumberType;
}
