import { NoteType } from "../constants/NoteType";
import Note from "../database/entities/Note";
import { BaseDto, mapBase } from "./BaseDto";

export interface NoteDto extends BaseDto {
    Text: string;
    Type: NoteType;
    ForId: string;
}

export function mapNote(note: Note): NoteDto {
    return {
        ...mapBase(note),
        Text: note.Text,
        Type: note.Type,
        ForId: note.ForId
    };
}
