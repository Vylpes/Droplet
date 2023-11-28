import { PostalService } from "../../../constants/PostalService";

export interface ITrackingNumber {
    uuid: string,
    number: string,
    service: PostalService,
}