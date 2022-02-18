import { DefaultSettings } from "../constants/DefaultSettings";
import { Settings } from "../entity/Settings";

export default class SettingsHelper {
    public static async SetSetting(key: string, value: string) {
        let setting = await Settings.FetchOneByKey(key);

        if (setting) {
            setting.EditBasicDetails(key, value);
        } else {
            setting = new Settings(key, value);
        }

        await setting.Save(Settings, setting);
    }

    public static async GetSetting(key: string): Promise<string> {
        const setting = await Settings.FetchOneByKey(key);

        if (setting) {
            return setting.Value;
        } else {
            return DefaultSettings[key];
        }
    }
}