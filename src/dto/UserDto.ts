import type { UserDto } from "@droplet/shared";
import { User } from "../database/entities/User";
import { mapBase } from "./BaseDto";

export type { UserDto } from "@droplet/shared";

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
