import { BaseDto } from "./BaseDto";

export interface UserDto extends BaseDto {
    Email: string;
    Username: string;
    Verified: boolean;
    Admin: boolean;
    Active: boolean;
}
