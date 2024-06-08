import { Request, Response } from "express";
import View from "../../../src/routes/items/view";
import { Item } from "../../../src/database/entities/Item";
import Note from "../../../src/database/entities/Note";
import { NoteType } from "../../../src/constants/NoteType";
import createHttpError from "http-errors";

describe("OnGetAsync", () => {
    test("EXPECT page to be rendered", async () => {
        // Arrange
        const req = {
            params: {
                itemId: "itemId",
            },
        } as unknown as Request;

        const res = {
            render: jest.fn(),
            locals: {
                viewData: {},
            },
        } as unknown as Response;

        const next = jest.fn();

        const item = {} as unknown as Item;

        const note1 = {
            WhenCreated: new Date("2024-06-01"),
        } as unknown as Note;

        const note2 = {
            WhenCreated: new Date("2024-06-02"),
        } as unknown as Note;

        Item.FetchOneById = jest.fn().mockResolvedValue(item);

        Note.FetchAllForId = jest.fn().mockResolvedValue([ note2, note1 ]);

        // Act
        const page = new View();
        await page.OnGetAsync(req, res, next);

        // Assert
        expect(res.render).toHaveBeenCalledTimes(1);
        expect(res.render).toHaveBeenCalledWith("items/view", res.locals.viewData);

        expect(next).not.toHaveBeenCalled();

        expect(Item.FetchOneById).toHaveBeenCalledTimes(1);
        expect(Item.FetchOneById).toHaveBeenCalledWith(Item, "itemId", [ "Purchase", "Storage", "Storage.Parent", "Storage.Parent.Parent" ]);

        expect(Note.FetchAllForId).toHaveBeenCalledTimes(1);
        expect(Note.FetchAllForId).toHaveBeenCalledWith(NoteType.Item, "itemId");

        expect(res.locals.notes).toStrictEqual([ note1, note2 ]);
    });

    test("GIVEN id parameter is not defined, EXPECT 404 error", async () => {
        // Arrange
        const req = {
            params: {
                itemId: undefined,
            },
        } as unknown as Request;

        const res = {
            render: jest.fn(),
            locals: {
                viewData: {},
            },
        } as unknown as Response;

        const next = jest.fn();

        const item = {} as unknown as Item;

        const note1 = {
            WhenCreated: new Date("2024-06-01"),
        } as unknown as Note;

        const note2 = {
            WhenCreated: new Date("2024-06-02"),
        } as unknown as Note;

        Item.FetchOneById = jest.fn().mockResolvedValue(item);

        Note.FetchAllForId = jest.fn().mockResolvedValue([ note2, note1 ]);

        // Act
        const page = new View();
        await page.OnGetAsync(req, res, next);

        // Assert
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(createHttpError(404));

        expect(Item.FetchOneById).not.toHaveBeenCalled();

        expect(Note.FetchAllForId).not.toHaveBeenCalled();

        expect(res.render).not.toHaveBeenCalled();
    });

    test("GIVEN item is not found, EXPECT 404 error", async () => {
        // Arrange
        const req = {
            params: {
                itemId: "itemId",
            },
        } as unknown as Request;

        const res = {
            render: jest.fn(),
            locals: {
                viewData: {},
            },
        } as unknown as Response;

        const next = jest.fn();

        const note1 = {
            WhenCreated: new Date("2024-06-01"),
        } as unknown as Note;

        const note2 = {
            WhenCreated: new Date("2024-06-02"),
        } as unknown as Note;

        Item.FetchOneById = jest.fn().mockResolvedValue(undefined);

        Note.FetchAllForId = jest.fn().mockResolvedValue([ note2, note1 ]);

        // Act
        const page = new View();
        await page.OnGetAsync(req, res, next);

        // Assert
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(createHttpError(404));

        expect(Item.FetchOneById).toHaveBeenCalledTimes(1);

        expect(Note.FetchAllForId).not.toHaveBeenCalled();

        expect(res.render).not.toHaveBeenCalled();
    });
});