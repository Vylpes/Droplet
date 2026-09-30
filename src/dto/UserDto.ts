import { User } from "../database/entities/User";
import { BaseDto, mapBase } from "./BaseDto";

export interface UserDto extends BaseDto {
    Email: string;
    Username: string;
    Verified: boolean;
    Admin: boolean;
    Active: boolean;
}

export function mapUser(user: User): UserDto {
    return {
        ...mapBase(user),
        Email: user.Email,
        Username: user.Username,
        Verified: user.Verified,
        Admin: user.Admin,
        Active: user.Active
    };
}
