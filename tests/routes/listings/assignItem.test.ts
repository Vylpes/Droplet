import { Request, Response } from "express";
import AssignItem from "../../../src/routes/listings/assignItem";
import BodyValidator from "../../../src/helpers/Validation/BodyValidator";
import { Item } from "../../../src/database/entities/Item";
import { Listing } from "../../../src/database/entities/Listing";
import { ItemStatus } from "../../../src/constants/Status/ItemStatus";
import createHttpError from "http-errors";

describe("OnPostAsync", () => {
    test("GIVEN body is valid, EXPECT item to be assigned to listing", async () => {
        // Arrange
        const req = {
            params: {
                Id: "listingId",
            },
            body: {
                itemId: "itemId",
            },
        } as unknown as Request;

        const res = {
            redirect: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        const item = {
            MarkAsListed: jest.fn(),
            Save: jest.fn(),
        } as unknown as Item;

        const listing = {
            Quantity: 1,
            AddItemToListing: jest.fn(),
            Save: jest.fn(),
        } as unknown as Listing;

        BodyValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        BodyValidator.prototype.Validate = jest.fn().mockResolvedValue(true);

        Item.FetchOneById = jest.fn().mockResolvedValue(item);

        Listing.FetchOneById = jest.fn().mockResolvedValue(listing);

        // Act
        const page = new AssignItem();
        await page.OnPostAsync(req, res, next);

        // Assert
        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(res.redirect).toHaveBeenCalledWith("/listings/view/listingId");

        expect(next).not.toHaveBeenCalled();

        expect(BodyValidator.prototype.NotEmpty).toHaveBeenCalledTimes(1);

        expect(BodyValidator.prototype.Validate).toHaveBeenCalledTimes(1);
        expect(BodyValidator.prototype.Validate).toHaveBeenCalledWith(req.body);

        expect(Item.FetchOneById).toHaveBeenCalledTimes(1);
        expect(Item.FetchOneById).toHaveBeenCalledWith(Item, "itemId");

        expect(Listing.FetchOneById).toHaveBeenCalledTimes(1);
        expect(Listing.FetchOneById).toHaveBeenCalledWith(Listing, "listingId", [ "Items" ]);

        expect(listing.AddItemToListing).toHaveBeenCalledTimes(1);
        expect(listing.AddItemToListing).toHaveBeenCalledWith(item);

        expect(listing.Save).toHaveBeenCalledTimes(1);
        expect(listing.Save).toHaveBeenCalledWith(Listing, listing);

        expect(item.MarkAsListed).toHaveBeenCalledTimes(1);
        expect(item.MarkAsListed).toHaveBeenCalledWith(1, ItemStatus.Unlisted);

        expect(item.Save).toHaveBeenCalledTimes(1);
        expect(item.Save).toHaveBeenCalledWith(Item, item);
    });

    test("GIVEN body is invalid, EXPECT redirect to listing page", async () => {
        // Arrange
        const req = {
            params: {
                Id: "listingId",
            },
            body: {
                itemId: "itemId",
            },
        } as unknown as Request;

        const res = {
            redirect: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        const item = {
            MarkAsListed: jest.fn(),
            Save: jest.fn(),
        } as unknown as Item;

        const listing = {
            Quantity: 1,
            AddItemToListing: jest.fn(),
            Save: jest.fn(),
        } as unknown as Listing;

        BodyValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        BodyValidator.prototype.Validate = jest.fn().mockResolvedValue(false);

        Item.FetchOneById = jest.fn().mockResolvedValue(item);

        Listing.FetchOneById = jest.fn().mockResolvedValue(listing);

        // Act
        const page = new AssignItem();
        await page.OnPostAsync(req, res, next);

        // Assert
        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(res.redirect).toHaveBeenCalledWith("/listings/view/listingId");

        expect(next).not.toHaveBeenCalled();

        expect(BodyValidator.prototype.Validate).toHaveBeenCalledTimes(1);
    });

    test("GIVEN item can not be found, EXPECT 404 error", async () => {
        // Arrange
        const req = {
            params: {
                Id: "listingId",
            },
            body: {
                itemId: "itemId",
            },
        } as unknown as Request;

        const res = {
            redirect: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        const listing = {
            Quantity: 1,
            AddItemToListing: jest.fn(),
            Save: jest.fn(),
        } as unknown as Listing;

        BodyValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        BodyValidator.prototype.Validate = jest.fn().mockResolvedValue(true);

        Item.FetchOneById = jest.fn().mockResolvedValue(undefined);

        Listing.FetchOneById = jest.fn().mockResolvedValue(listing);

        // Act
        const page = new AssignItem();
        await page.OnPostAsync(req, res, next);

        // Assert
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(createHttpError(404));

        expect(res.redirect).not.toHaveBeenCalled();

        expect(Listing.FetchOneById).not.toHaveBeenCalled();
    });

    test("GIVEN listing can not be found, EXPECT 404 error", async () => {
        // Arrange
        const req = {
            params: {
                Id: "listingId",
            },
            body: {
                itemId: "itemId",
            },
        } as unknown as Request;

        const res = {
            redirect: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        const item = {
            MarkAsListed: jest.fn(),
            Save: jest.fn(),
        } as unknown as Item;

        BodyValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        BodyValidator.prototype.Validate = jest.fn().mockResolvedValue(true);

        Item.FetchOneById = jest.fn().mockResolvedValue(item);

        Listing.FetchOneById = jest.fn().mockResolvedValue(undefined);

        // Act
        const page = new AssignItem();
        await page.OnPostAsync(req, res, next);

        // Assert
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(createHttpError(404));

        expect(res.redirect).not.toHaveBeenCalled();

        expect(item.Save).not.toHaveBeenCalled();
    });
});