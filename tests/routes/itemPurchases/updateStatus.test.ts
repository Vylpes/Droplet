import { Request, Response } from "express";
import UpdateStatus from "../../../src/routes/itemPurchases/updateStatus";
import { ItemPurchase } from "../../../src/database/entities/ItemPurchase";
import { ItemPurchaseStatus } from "../../../src/constants/Status/ItemPurchaseStatus";
import BodyValidator from "../../../src/helpers/Validation/BodyValidator";
import createHttpError from "http-errors";

describe("OnPostAsync", () => {
    test("GIVEN body is valid, EXPECT item purchase status to be updated", async () => {
        // Arrange
        const req = {
            params: {
                Id: "itemPurchaseId",
            },
            body: {
                status: 3,
            },
        } as unknown as Request;

        const res = {
            redirect: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        const itemPurchase = {
            UpdateStatus: jest.fn(),
            Save: jest.fn(),
        } as unknown as ItemPurchase;

        BodyValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        BodyValidator.prototype.Number = jest.fn().mockReturnThis();
        BodyValidator.prototype.Validate = jest.fn().mockResolvedValue(true);

        ItemPurchase.FetchOneById = jest.fn().mockResolvedValue(itemPurchase);

        // Act
        const page = new UpdateStatus();
        await page.OnPostAsync(req, res, next);

        // Assert
        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(res.redirect).toHaveBeenCalledWith("/item-purchases/view/itemPurchaseId");

        expect(BodyValidator.prototype.NotEmpty).toHaveBeenCalledTimes(1);
        expect(BodyValidator.prototype.Number).toHaveBeenCalledTimes(1);

        expect(BodyValidator.prototype.Validate).toHaveBeenCalledTimes(1);
        expect(BodyValidator.prototype.Validate).toHaveBeenCalledWith(req.body);

        expect(ItemPurchase.FetchOneById).toHaveBeenCalledTimes(1);
        expect(ItemPurchase.FetchOneById).toHaveBeenCalledWith(ItemPurchase, "itemPurchaseId");

        expect(itemPurchase.UpdateStatus).toHaveBeenCalledTimes(1);
        expect(itemPurchase.UpdateStatus).toHaveBeenCalledWith(ItemPurchaseStatus.Complete);

        expect(itemPurchase.Save).toHaveBeenCalledTimes(1);
        expect(itemPurchase.Save).toHaveBeenCalledWith(ItemPurchase, itemPurchase);

        expect(next).not.toHaveBeenCalled();
    });

    test("GIVEN body is invalid, EXPECT redirect to itemPurchase page", async () => {
        // Arrange
        const req = {
            params: {
                Id: "itemPurchaseId",
            },
            body: {
                status: 3,
            },
        } as unknown as Request;

        const res = {
            redirect: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        const itemPurchase = {
            UpdateStatus: jest.fn(),
            Save: jest.fn(),
        } as unknown as ItemPurchase;

        BodyValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        BodyValidator.prototype.Number = jest.fn().mockReturnThis();
        BodyValidator.prototype.Validate = jest.fn().mockResolvedValue(false);

        ItemPurchase.FetchOneById = jest.fn().mockResolvedValue(itemPurchase);

        // Act
        const page = new UpdateStatus();
        await page.OnPostAsync(req, res, next);

        // Assert
        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(res.redirect).toHaveBeenCalledWith("/item-purchases/view/itemPurchaseId");

        expect(ItemPurchase.FetchOneById).not.toHaveBeenCalled();
    });

    test("GIVEN item purchase can not be found, EXPECT 404 error", async () => {
        // Arrange
        const req = {
            params: {
                Id: "itemPurchaseId",
            },
            body: {
                status: 3,
            },
        } as unknown as Request;

        const res = {
            redirect: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        BodyValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        BodyValidator.prototype.Number = jest.fn().mockReturnThis();
        BodyValidator.prototype.Validate = jest.fn().mockResolvedValue(true);

        ItemPurchase.FetchOneById = jest.fn().mockResolvedValue(undefined);

        // Act
        const page = new UpdateStatus();
        await page.OnPostAsync(req, res, next);

        // Assert
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(createHttpError(404));

        expect(res.redirect).not.toHaveBeenCalled();
    });
});