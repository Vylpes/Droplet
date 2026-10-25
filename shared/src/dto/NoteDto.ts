import { NoteType } from "../constants/NoteType";
import { BaseDto } from "./BaseDto";

export interface NoteDto extends BaseDto {
    Text: string;
    Type: NoteType;
    ForId: string;
}
