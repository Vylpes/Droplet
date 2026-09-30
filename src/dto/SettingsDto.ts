import { Settings } from "../database/entities/Settings";
import { BaseDto, mapBase } from "./BaseDto";

export interface SettingsDto extends BaseDto {
    Key: string;
    Value: string;
}

export function mapSettings(settings: Settings): SettingsDto {
    return {
        ...mapBase(settings),
        Key: settings.Key,
        Value: settings.Value
    };
}
