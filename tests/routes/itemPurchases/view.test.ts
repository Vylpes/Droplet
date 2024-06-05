import { Request, Response } from "express";
import View from "../../../src/routes/itemPurchases/view";
import { ItemPurchase } from "../../../src/database/entities/ItemPurchase";
import Note from "../../../src/database/entities/Note";
import { NoteType } from "../../../src/constants/NoteType";
import createHttpError from "http-errors";

describe("OnGetAsync", () => {
    test("GIVEN purchase can be found, EXPECT page to be rendered", async () => {
        // Arrange
        const req = {
            params: {
                Id: "itemPurchaseId",
            }
        } as unknown as Request;

        const res = {
            render: jest.fn(),
            locals: {
                viewData: {},
            },
        } as unknown as Response;

        const next = jest.fn();

        const purchase = {
            Id: "itemPurchaseId",
        } as unknown as ItemPurchase;

        const note1 = {
            WhenCreated: new Date("2024-06-01")
        } as unknown as Note;

        const note2 = {
            WhenCreated: new Date("2024-06-02")
        } as unknown as Note;

        ItemPurchase.FetchOneById = jest.fn().mockResolvedValue(purchase);

        Note.FetchAllForId = jest.fn().mockResolvedValue([ note2, note1 ]);

        // Act
        const page = new View();
        await page.OnGetAsync(req, res, next);

        // Assert
        expect(res.render).toHaveBeenCalledTimes(1);
        expect(res.render).toHaveBeenCalledWith("item-purchases/view", {});

        expect(res.locals.purchase).toBe(purchase);

        expect(res.locals.notes).toStrictEqual([note1, note2]);

        expect(ItemPurchase.FetchOneById).toHaveBeenCalledTimes(1);
        expect(ItemPurchase.FetchOneById).toHaveBeenCalledWith(ItemPurchase, "itemPurchaseId", [ "Items" ]);

        expect(Note.FetchAllForId).toHaveBeenCalledTimes(1);
        expect(Note.FetchAllForId).toHaveBeenCalledWith(NoteType.ItemPurchase, "itemPurchaseId");

        expect(next).not.toHaveBeenCalled();
    });

    test("GIVEN id parameter is undefined, EXPECT 404 error", async () => {
        // Arrange
        const req = {
            params: {
                Id: undefined,
            }
        } as unknown as Request;

        const res = {
            render: jest.fn(),
            locals: {
                viewData: {},
            },
        } as unknown as Response;

        const next = jest.fn();

        const purchase = {
            Id: "itemPurchaseId",
        } as unknown as ItemPurchase;

        const note1 = {
            WhenCreated: new Date("2024-06-01")
        } as unknown as Note;

        const note2 = {
            WhenCreated: new Date("2024-06-02")
        } as unknown as Note;

        ItemPurchase.FetchOneById = jest.fn().mockResolvedValue(purchase);

        Note.FetchAllForId = jest.fn().mockResolvedValue([ note2, note1 ]);

        // Act
        const page = new View();
        await page.OnGetAsync(req, res, next);

        // Assert
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(createHttpError(404));

        expect(ItemPurchase.FetchOneById).not.toHaveBeenCalled();

        expect(Note.FetchAllForId).not.toHaveBeenCalled();

        expect(res.render).not.toHaveBeenCalled();
    });

    test("GIVEN purchase is not found, EXPECT 404 error", async () => {
        // Arrange
        const req = {
            params: {
                Id: "itemPurchaseId",
            }
        } as unknown as Request;

        const res = {
            render: jest.fn(),
            locals: {
                viewData: {},
            },
        } as unknown as Response;

        const next = jest.fn();

        const note1 = {
            WhenCreated: new Date("2024-06-01")
        } as unknown as Note;

        const note2 = {
            WhenCreated: new Date("2024-06-02")
        } as unknown as Note;

        ItemPurchase.FetchOneById = jest.fn().mockResolvedValue(undefined);

        Note.FetchAllForId = jest.fn().mockResolvedValue([ note2, note1 ]);

        // Act
        const page = new View();
        await page.OnGetAsync(req, res, next);

        // Assert
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(createHttpError(404));

        expect(ItemPurchase.FetchOneById).toHaveBeenCalledTimes(1);

        expect(Note.FetchAllForId).not.toHaveBeenCalled();

        expect(res.render).not.toHaveBeenCalled();
    });
});