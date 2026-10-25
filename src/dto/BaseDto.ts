import type { BaseDto } from "@droplet/shared";

export type { BaseDto } from "@droplet/shared";

export function mapBase(entity: { Id: string; WhenCreated: Date; WhenUpdated: Date }): BaseDto {
    return {
        Id: entity.Id,
        WhenCreated: entity.WhenCreated,
        WhenUpdated: entity.WhenUpdated
    };
}
