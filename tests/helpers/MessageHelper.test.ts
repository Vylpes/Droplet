import MessageHelper from '../../src/helpers/MessageHelper';
import { Request } from 'express';

describe("constructor", () => {
    test("EXPECT properties to be set", () => {
        // Arrange
        const req = {} as Request;

        // Act
        const messageHelper = new MessageHelper(req);

        // Assert
        expect(messageHelper).toHaveProperty("_req", req);
    });
});

describe("Info", () => {
    test("EXPECT flash to be set with info", async () => {
        // Arrange
        const req = {
            flash: jest.fn(),
            session: {
                save: jest.fn().mockImplementation((callback) => {
                    callback(undefined);
                }),
            },
        } as unknown as Request;
        const messageHelper = new MessageHelper(req);
        const text = "Info message";

        // Act
        await messageHelper.Info(text);

        // Assert
        expect(req.flash).toBeCalledWith('info', text);
    });

    test("GIVEN session.save returns error, EXPECT reject to be called", async () => {
        // Arrange
        const req = {
            flash: jest.fn(),
            session: {
                save: jest.fn().mockImplementation((callback) => {
                    callback("Error");
                }),
            },
        } as unknown as Request;
        const messageHelper = new MessageHelper(req);
        const text = "Info message";

        // Act
        await expect(messageHelper.Info(text)).rejects.toBeUndefined();
    });
});

describe("Error", () => {
    test("EXPECT flash to be set with error", async () => {
        // Arrange
        const req = {
            flash: jest.fn(),
            session: {
                save: jest.fn().mockImplementation((callback) => {
                    callback(undefined);
                }),
            },
        } as unknown as Request;
        const messageHelper = new MessageHelper(req);
        const text = "Error message";

        // Act
        await messageHelper.Error(text);

        // Assert
        expect(req.flash).toBeCalledWith('error', text);
    });

    test("GIVEN session.save returns error, EXPECT reject to be called", async () => {
        // Arrange
        const req = {
            flash: jest.fn(),
            session: {
                save: jest.fn().mockImplementation((callback) => {
                    callback("Error");
                }),
            },
        } as unknown as Request;
        const messageHelper = new MessageHelper(req);
        const text = "Error message";

        // Act
        await expect(messageHelper.Error(text)).rejects.toBeUndefined();
    });
});