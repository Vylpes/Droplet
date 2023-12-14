import { PostalService } from "../../../constants/PostalService";

export interface TrackingNumber {
    uuid: string,
    number: string,
    service: PostalService,
}