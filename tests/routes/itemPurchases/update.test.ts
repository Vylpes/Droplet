import { Request, Response } from "express";
import Update from "../../../src/routes/itemPurchases/update";
import BodyValidator from "../../../src/helpers/Validation/BodyValidator";
import { ItemPurchase } from "../../../src/database/entities/ItemPurchase";

describe("OnPostAsync", () => {
    test("GIVEN body is valid, EXPECT item purchase to be updated", async () => {
        // Arrange
        const req = {
            params: {
                Id: "itemPurchaseId",
            },
            body: {
                description: "description",
                price: 1.99,
            }
        } as unknown as Request;

        const res = {
            redirect: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        const itemPurchase = {
            UpdateBasicDetails: jest.fn(),
            CalculateItemPrices: jest.fn(),
            Save: jest.fn(),
        } as unknown as ItemPurchase;

        BodyValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        BodyValidator.prototype.ChangeField = jest.fn().mockReturnThis();
        BodyValidator.prototype.Number = jest.fn().mockReturnThis();
        BodyValidator.prototype.Validate = jest.fn().mockResolvedValue(true);

        ItemPurchase.FetchOneById = jest.fn().mockResolvedValue(itemPurchase);

        // Act
        const page = new Update();
        await page.OnPostAsync(req, res, next);

        // Assert
        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(res.redirect).toHaveBeenCalledWith("/item-purchases/view/itemPurchaseId");

        expect(BodyValidator.prototype.NotEmpty).toHaveBeenCalledTimes(2);

        expect(BodyValidator.prototype.ChangeField).toHaveBeenCalledTimes(1);
        expect(BodyValidator.prototype.ChangeField).toHaveBeenCalledWith("price");

        expect(BodyValidator.prototype.Number).toHaveBeenCalledTimes(1);

        expect(BodyValidator.prototype.Validate).toHaveBeenCalledTimes(1);
        expect(BodyValidator.prototype.Validate).toHaveBeenCalledWith(req.body);

        expect(ItemPurchase.FetchOneById).toHaveBeenCalledTimes(1);
        expect(ItemPurchase.FetchOneById).toHaveBeenCalledWith(ItemPurchase, "itemPurchaseId", [ "Items" ]);

        expect(itemPurchase.UpdateBasicDetails).toHaveBeenCalledTimes(1);
        expect(itemPurchase.UpdateBasicDetails).toHaveBeenCalledWith("description", 1.99);

        expect(itemPurchase.Save).toHaveBeenCalledTimes(1);
        expect(itemPurchase.Save).toHaveBeenCalledWith(ItemPurchase, itemPurchase);

        expect(itemPurchase.CalculateItemPrices).toHaveBeenCalledTimes(1);
    });

    test.todo("GIVEN body is invalid, EXPECT redirect to itemPurchase page");

    test.todo("GIVEN item purchase can not be found, EXPECT 404 error");
});