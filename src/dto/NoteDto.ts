import type { NoteDto } from "@droplet/shared";
import Note from "../database/entities/Note";
import { mapBase } from "./BaseDto";

export type { NoteDto } from "@droplet/shared";

export function mapNote(note: Note): NoteDto {
    return {
        ...mapBase(note),
        Text: note.Text,
        Type: note.Type,
        ForId: note.ForId
    };
}
