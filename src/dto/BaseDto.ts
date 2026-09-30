export interface BaseDto {
    Id: string;
    WhenCreated: Date;
    WhenUpdated: Date;
}

export function mapBase(entity: { Id: string; WhenCreated: Date; WhenUpdated: Date }): BaseDto {
    return {
        Id: entity.Id,
        WhenCreated: entity.WhenCreated,
        WhenUpdated: entity.WhenUpdated
    };
}
