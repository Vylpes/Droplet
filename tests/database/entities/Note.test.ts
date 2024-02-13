import { Repository } from 'typeorm';
import { NoteType } from '../../../src/constants/NoteType';
import AppDataSource from '../../../src/database/dataSources/appDataSource';
import Note from '../../../src/database/entities/Note';

describe("Note", () => {
    describe("constructor", () => {
        test("EXPECT properties to be set", () => {
            // Arrange
            const text = "Sample text";
            const type = NoteType.Item;
            const forId = "123";

            // Act
            const note = new Note(text, type, forId);

            // Assert
            expect(note.Text).toBe(text);
            expect(note.Type).toBe(type);
            expect(note.ForId).toBe(forId);
        });
    });

    describe("UpdateBasicDetails", () => {
        test("EXPECT properties to be updated", () => {
            // Arrange
            const note = new Note("Sample text", NoteType.Item, "123");
            const newText = "Updated text";

            // Act
            note.UpdateBasicDetails(newText);

            // Assert
            expect(note.Text).toBe(newText);
        });
    });

    describe("FetchAllForId", () => {
        test("EXPECT all notes for an id of a note type to be returned", async () => {
            // Arrange
            const type = NoteType.Item;
            const forId = "123";
            const note1 = new Note("Sample text 1", type, forId);
            const note2 = new Note("Sample text 2", type, forId);
            const note3 = new Note("Sample text 3", NoteType.Supply, forId);
            const allNotes = [note1, note2, note3];

            // Mock the repository find method
            const mockFind = jest.fn().mockResolvedValue(allNotes);
            const mockRepository = {
                find: mockFind
            } as unknown as Repository<Note>;
            jest.spyOn(AppDataSource, 'getRepository').mockReturnValue(mockRepository);

            // Act
            const result = await Note.FetchAllForId(type, forId);

            // Assert
            expect(result).toEqual([note1, note2]);
            expect(mockFind).toHaveBeenCalled();
        });
    });
});