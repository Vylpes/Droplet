import { Request, Response } from "express";
import New from "../../../src/routes/items/new";
import { ItemPurchase } from "../../../src/database/entities/ItemPurchase";
import BodyValidator from "../../../src/helpers/Validation/BodyValidator";
import { Item } from "../../../src/database/entities/Item";
import createHttpError from "http-errors";

describe("OnPostAsync", () => {
    test("GIVEN body is valid, EXPECT item to be added", async () => {
        let savedItem: Item | undefined;

        // Arrange
        const req = {
            body: {
                name: "name",
                quantity: 1,
                purchaseId: "purchaseId",
            },
        } as unknown as Request;

        const res = {
            redirect: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        const purchase = {
            AddItemToOrder: jest.fn(),
            Save: jest.fn(),
            CalculateItemPrices: jest.fn(),
        } as unknown as ItemPurchase;

        BodyValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        BodyValidator.prototype.ChangeField = jest.fn().mockReturnThis();
        BodyValidator.prototype.Number = jest.fn().mockReturnThis();
        BodyValidator.prototype.Validate = jest.fn().mockResolvedValue(true);

        ItemPurchase.FetchOneById = jest.fn().mockResolvedValue(purchase);

        Item.prototype.Save = jest.fn().mockImplementation((_, item: Item) => {
            savedItem = item;
        });

        // Act
        const page = new New();
        await page.OnPostAsync(req, res, next);

        // Assert
        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(res.redirect).toHaveBeenCalledWith("/item-purchases/view/purchaseId");

        expect(next).not.toHaveBeenCalled();

        expect(BodyValidator.prototype.NotEmpty).toHaveBeenCalledTimes(3);

        expect(BodyValidator.prototype.ChangeField).toHaveBeenCalledTimes(2);
        expect(BodyValidator.prototype.ChangeField).toHaveBeenCalledWith("quantity");
        expect(BodyValidator.prototype.ChangeField).toHaveBeenCalledWith("purchaseId");

        expect(BodyValidator.prototype.Number).toHaveBeenCalledTimes(1);

        expect(BodyValidator.prototype.Validate).toHaveBeenCalledTimes(1);
        expect(BodyValidator.prototype.Validate).toHaveBeenCalledWith(req.body);

        expect(Item.prototype.Save).toHaveBeenCalledTimes(1);
        expect(Item.prototype.Save).toHaveBeenCalledWith(Item, savedItem);

        expect(ItemPurchase.FetchOneById).toHaveBeenCalledTimes(2);
        expect(ItemPurchase.FetchOneById).toHaveBeenCalledWith(ItemPurchase, "purchaseId", [ "Items" ]);

        expect(purchase.AddItemToOrder).toHaveBeenCalledTimes(1);
        expect(purchase.AddItemToOrder).toHaveBeenCalledWith(savedItem);

        expect(purchase.Save).toHaveBeenCalledTimes(1);
        expect(purchase.Save).toHaveBeenCalledWith(ItemPurchase, purchase);

        expect(purchase.CalculateItemPrices).toHaveBeenCalledTimes(1);

        expect(savedItem).toBeDefined();
        expect(savedItem?.Name).toBe("name");
        expect(savedItem?.UnlistedQuantity).toBe(1);
    });

    test("GIVEN body is invalid, EXPECT to be redirected early", async () => {
        let savedItem: Item | undefined;

        // Arrange
        const req = {
            body: {
                name: "name",
                quantity: 1,
                purchaseId: "purchaseId",
            },
        } as unknown as Request;

        const res = {
            redirect: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        const purchase = {
            AddItemToOrder: jest.fn(),
            Save: jest.fn(),
            CalculateItemPrices: jest.fn(),
        } as unknown as ItemPurchase;

        BodyValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        BodyValidator.prototype.ChangeField = jest.fn().mockReturnThis();
        BodyValidator.prototype.Number = jest.fn().mockReturnThis();
        BodyValidator.prototype.Validate = jest.fn().mockResolvedValue(false);

        ItemPurchase.FetchOneById = jest.fn().mockResolvedValue(purchase);

        Item.prototype.Save = jest.fn().mockImplementation((_, item: Item) => {
            savedItem = item;
        });

        // Act
        const page = new New();
        await page.OnPostAsync(req, res, next);

        // Assert
        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(res.redirect).toHaveBeenCalledWith("/item-purchases/ordered");

        expect(next).not.toHaveBeenCalled();

        expect(Item.prototype.Save).not.toHaveBeenCalled();

        expect(ItemPurchase.FetchOneById).not.toHaveBeenCalled();
    });

    test("GIVEN item purchase can not be found, EXPECT 404 error", async () => {
        let savedItem: Item | undefined;

        // Arrange
        const req = {
            body: {
                name: "name",
                quantity: 1,
                purchaseId: "purchaseId",
            },
        } as unknown as Request;

        const res = {
            redirect: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        BodyValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        BodyValidator.prototype.ChangeField = jest.fn().mockReturnThis();
        BodyValidator.prototype.Number = jest.fn().mockReturnThis();
        BodyValidator.prototype.Validate = jest.fn().mockResolvedValue(true);

        ItemPurchase.FetchOneById = jest.fn().mockResolvedValue(undefined);

        Item.prototype.Save = jest.fn().mockImplementation((_, item: Item) => {
            savedItem = item;
        });

        // Act
        const page = new New();
        await page.OnPostAsync(req, res, next);

        // Assert
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(createHttpError(404));

        expect(res.redirect).not.toHaveBeenCalled();

        expect(Item.prototype.Save).not.toHaveBeenCalled();
    });
});