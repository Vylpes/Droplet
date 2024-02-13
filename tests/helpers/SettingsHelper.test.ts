import { DefaultSettings } from '../../src/constants/DefaultSettings';
import { Settings } from '../../src/database/entities/Settings';
import SettingsHelper from '../../src/helpers/SettingsHelper';

beforeEach(() => {
    DefaultSettings["testKey"] = null;
});

describe("SetSetting", () => {
    test("GIVEN setting does not exist, EXPECT setting to be created", async () => {
        // Arrange
        const key = "testKey";
        const value = "testValue";
        const fetchOneByKeyMock = jest.spyOn(Settings, 'FetchOneByKey').mockResolvedValueOnce(null);
        const saveMock = jest.spyOn(Settings.prototype, 'Save').mockResolvedValueOnce();

        // Act
        await SettingsHelper.SetSetting(key, value);

        // Assert
        expect(fetchOneByKeyMock).toHaveBeenCalledWith(key);
        expect(saveMock).toHaveBeenCalledWith(Settings, expect.objectContaining({
            Key: key,
            Value: value
        }));
    });

    test("GIVEN setting exists, EXPECT setting to be updated", async () => {
        // Arrange
        const key = "testKey";
        const value = "testValue";
        const existingSetting = new Settings(key, "oldValue");
        const fetchOneByKeyMock = jest.spyOn(Settings, 'FetchOneByKey').mockResolvedValueOnce(existingSetting);
        const editBasicDetailsMock = jest.spyOn(existingSetting, 'EditBasicDetails').mockImplementationOnce(() => {});
        const saveMock = jest.spyOn(Settings.prototype, 'Save').mockResolvedValueOnce();

        // Act
        await SettingsHelper.SetSetting(key, value);

        // Assert
        expect(fetchOneByKeyMock).toHaveBeenCalledWith(key);
        expect(editBasicDetailsMock).toHaveBeenCalledWith(key, value);
        expect(saveMock).toHaveBeenCalledWith(Settings, existingSetting);
    });
});

describe("GetSetting", () => {
    test("GIVEN setting exists, EXPECT setting to be returned", async () => {
        // Arrange
        const key = "testKey";
        const value = "testValue";
        const existingSetting = new Settings(key, value);
        const fetchOneByKeyMock = jest.spyOn(Settings, 'FetchOneByKey').mockResolvedValueOnce(existingSetting);

        // Act
        const result = await SettingsHelper.GetSetting(key);

        // Assert
        expect(fetchOneByKeyMock).toHaveBeenCalledWith(key);
        expect(result).toBe(value);
    });

    test("GIVEN setting does not exist, EXPECT default to be returned", async () => {
        // Arrange
        const key = "testKey";
        const defaultValue = "defaultValue";
        const fetchOneByKeyMock = jest.spyOn(Settings, 'FetchOneByKey').mockResolvedValueOnce(null);
        DefaultSettings[key] = defaultValue;

        // Act
        const result = await SettingsHelper.GetSetting(key);

        // Assert
        expect(fetchOneByKeyMock).toHaveBeenCalledWith(key);
        expect(result).toBe(defaultValue);
    });

    test("GIVEN setting does not exist and no default is provided, EXPECT null to be returned", async () => {
        // Arrange
        const key = "testKey";
        const fetchOneByKeyMock = jest.spyOn(Settings, 'FetchOneByKey').mockResolvedValueOnce(null);

        // Act
        const result = await SettingsHelper.GetSetting(key);

        // Assert
        expect(fetchOneByKeyMock).toHaveBeenCalledWith(key);
        expect(result).toBeNull();
    });
});