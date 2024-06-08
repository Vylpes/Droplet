import { Request, Response } from "express";
import Update from "../../../src/routes/items/update";
import BodyValidator from "../../../src/helpers/Validation/BodyValidator";
import { Item } from "../../../src/database/entities/Item";
import createHttpError from "http-errors";

describe("OnPostAsync", () => {
    test("GIVEN body is valid, EXPECT item to be updated", async () => {
        // Arrange
        const req = {
            params: {
                itemId: "itemId",
            },
            body: {
                name: "name",
            },
        } as unknown as Request;

        const res = {
            redirect: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        const item = {
            EditBasicDetails: jest.fn(),
            Save: jest.fn(),
        } as unknown as Item;

        BodyValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        BodyValidator.prototype.Validate = jest.fn().mockResolvedValue(true);

        Item.FetchOneById = jest.fn().mockResolvedValue(item);

        // Act
        const page = new Update();
        await page.OnPostAsync(req, res, next);

        // Assert
        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(res.redirect).toHaveBeenCalledWith("/items/itemId");

        expect(next).not.toHaveBeenCalled();

        expect(BodyValidator.prototype.NotEmpty).toHaveBeenCalledTimes(1);

        expect(BodyValidator.prototype.Validate).toHaveBeenCalledTimes(1);
        expect(BodyValidator.prototype.Validate).toHaveBeenCalledWith(req.body);

        expect(Item.FetchOneById).toHaveBeenCalledTimes(1);
        expect(Item.FetchOneById).toHaveBeenCalledWith(Item, "itemId");

        expect(item.EditBasicDetails).toHaveBeenCalledTimes(1);
        expect(item.EditBasicDetails).toHaveBeenCalledWith("name");

        expect(item.Save).toHaveBeenCalledTimes(1);
        expect(item.Save).toHaveBeenCalledWith(Item, item);
    });

    test("GIVEN body is invalid, EXPECT redirect to item page", async () => {
        // Arrange
        const req = {
            params: {
                itemId: "itemId",
            },
            body: {
                name: "name",
            },
        } as unknown as Request;

        const res = {
            redirect: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        const item = {
            EditBasicDetails: jest.fn(),
            Save: jest.fn(),
        } as unknown as Item;

        BodyValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        BodyValidator.prototype.Validate = jest.fn().mockResolvedValue(false);

        Item.FetchOneById = jest.fn().mockResolvedValue(item);

        // Act
        const page = new Update();
        await page.OnPostAsync(req, res, next);

        // Assert
        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(res.redirect).toHaveBeenCalledWith("/items/itemId");

        expect(next).not.toHaveBeenCalled();

        expect(Item.FetchOneById).not.toHaveBeenCalled();
    });

    test("GIVEN item can not be found, EXPECT 404 error", async () => {
        // Arrange
        const req = {
            params: {
                itemId: "itemId",
            },
            body: {
                name: "name",
            },
        } as unknown as Request;

        const res = {
            redirect: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        BodyValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        BodyValidator.prototype.Validate = jest.fn().mockResolvedValue(true);

        Item.FetchOneById = jest.fn().mockResolvedValue(undefined);

        // Act
        const page = new Update();
        await page.OnPostAsync(req, res, next);

        // Assert
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(createHttpError(404));

        expect(res.redirect).not.toHaveBeenCalled();

        expect(Item.FetchOneById).toHaveBeenCalledTimes(1);
    });
});