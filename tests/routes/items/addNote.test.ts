import { Request, Response } from "express";
import AddNote from "../../../src/routes/items/addNote";
import BodyValidator from "../../../src/helpers/Validation/BodyValidator";
import Note from "../../../src/database/entities/Note";
import { NoteType } from "../../../src/constants/NoteType";

describe("OnPostAsync", () => {
    test("GIVEN body is valid, EXPECT note to be added", async () => {
        let savedNote: Note | undefined;

        // Arrange
        const req = {
            params: {
                itemId: "itemId",
            },
            body: {
                text: "note text",
            },
        } as unknown as Request;

        const res = {
            redirect: jest.fn(),
        } as unknown as Response;

        BodyValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        BodyValidator.prototype.Validate = jest.fn().mockResolvedValue(true);

        Note.prototype.Save = jest.fn().mockImplementation((_, note: Note) => {
            savedNote = note;
        });

        // Act
        const page = new AddNote();
        await page.OnPostAsync(req, res);

        // Assert
        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(res.redirect).toHaveBeenCalledWith("/items/itemId");

        expect(BodyValidator.prototype.NotEmpty).toHaveBeenCalledTimes(1);

        expect(BodyValidator.prototype.Validate).toHaveBeenCalledTimes(1);
        expect(BodyValidator.prototype.Validate).toHaveBeenCalledWith(req.body);

        expect(Note.prototype.Save).toHaveBeenCalledTimes(1);
        expect(Note.prototype.Save).toHaveBeenCalledWith(Note, savedNote);

        expect(savedNote).toBeDefined();
        expect(savedNote!.Text).toBe("note text");
        expect(savedNote!.Type).toBe(NoteType.Item);
        expect(savedNote!.ForId).toBe("itemId");
    });

    test("GIVEN body is invalid, EXPECT redirect to item page", async () => {
        let savedNote: Note | undefined;

        // Arrange
        const req = {
            params: {
                itemId: "itemId",
            },
            body: {
                text: "note text",
            },
        } as unknown as Request;

        const res = {
            redirect: jest.fn(),
        } as unknown as Response;

        BodyValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        BodyValidator.prototype.Validate = jest.fn().mockResolvedValue(false);

        Note.prototype.Save = jest.fn().mockImplementation((_, note: Note) => {
            savedNote = note;
        });

        // Act
        const page = new AddNote();
        await page.OnPostAsync(req, res);

        // Assert
        expect(BodyValidator.prototype.Validate).toHaveBeenCalledTimes(1);

        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(res.redirect).toHaveBeenCalledWith("/items/itemId");

        expect(Note.prototype.Save).not.toHaveBeenCalled();
    });
});