import { Request, Response } from "express";
import New from "../../../src/routes/itemPurchases/new";
import BodyValidator from "../../../src/helpers/Validation/BodyValidator";
import { ItemPurchase } from "../../../src/database/entities/ItemPurchase";

describe("OnPostAsync", () => {
    test("GIVEN body is valid, EXPECT item purchase to be added", async () => {
        let savedItemPurchase: ItemPurchase | undefined;

        // Arrange
        const req = {
            body: {
                description: "description",
                price: 1.99,
            }
        } as unknown as Request;

        const res = {
            redirect: jest.fn(),
        } as unknown as Response;

        BodyValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        BodyValidator.prototype.ChangeField = jest.fn().mockReturnThis();
        BodyValidator.prototype.Number = jest.fn().mockReturnThis();
        BodyValidator.prototype.Validate = jest.fn().mockResolvedValue(true);

        ItemPurchase.prototype.Save = jest.fn().mockImplementation((_, purchase: ItemPurchase) => {
            savedItemPurchase = purchase;
        });

        // Act
        const page = new New();
        await page.OnPostAsync(req, res);

        // Assert
        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(res.redirect).toHaveBeenCalledWith("/item-purchases/ordered");

        expect(BodyValidator.prototype.NotEmpty).toHaveBeenCalledTimes(2);

        expect(BodyValidator.prototype.Number).toHaveBeenCalledTimes(1);

        expect(BodyValidator.prototype.ChangeField).toHaveBeenCalledTimes(1);
        expect(BodyValidator.prototype.ChangeField).toHaveBeenCalledWith("price");

        expect(BodyValidator.prototype.Validate).toHaveBeenCalledTimes(1);
        expect(BodyValidator.prototype.Validate).toHaveBeenCalledWith(req.body);

        expect(ItemPurchase.prototype.Save).toHaveBeenCalledTimes(1);
        expect(ItemPurchase.prototype.Save).toHaveBeenCalledWith(ItemPurchase, expect.any(ItemPurchase));

        expect(savedItemPurchase).toBeDefined();
        expect(savedItemPurchase!.Description).toBe("description");
        expect(savedItemPurchase!.Price).toBe(1.99);
    });

    test("GIVEN body is invalid, EXPECT nothing to happen", async () => {
        let savedItemPurchase: ItemPurchase | undefined;

        // Arrange
        const req = {
            body: {
                description: "description",
                price: 1.99,
            }
        } as unknown as Request;

        const res = {
            redirect: jest.fn(),
        } as unknown as Response;

        BodyValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        BodyValidator.prototype.ChangeField = jest.fn().mockReturnThis();
        BodyValidator.prototype.Number = jest.fn().mockReturnThis();
        BodyValidator.prototype.Validate = jest.fn().mockResolvedValue(false);

        ItemPurchase.prototype.Save = jest.fn().mockImplementation((_, purchase: ItemPurchase) => {
            savedItemPurchase = purchase;
        });

        // Act
        const page = new New();
        await page.OnPostAsync(req, res);

        // Assert
        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(res.redirect).toHaveBeenCalledWith("/item-purchases/ordered");

        expect(savedItemPurchase).toBeUndefined();

        expect(ItemPurchase.prototype.Save).not.toHaveBeenCalled();
    });
});