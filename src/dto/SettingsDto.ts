import type { SettingsDto } from "@droplet/shared";
import { Settings } from "../database/entities/Settings";
import { mapBase } from "./BaseDto";

export type { SettingsDto } from "@droplet/shared";

export function mapSettings(settings: Settings): SettingsDto {
    return {
        ...mapBase(settings),
        Key: settings.Key,
        Value: settings.Value
    };
}
