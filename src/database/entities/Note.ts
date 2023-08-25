import { Column, Entity } from "typeorm";
import { NoteType } from "../../constants/NoteType";
import BaseEntity from "../../contracts/BaseEntity";
import AppDataSource from "../dataSources/appDataSource";

@Entity()
export default class Note extends BaseEntity {
    constructor(text: String, type: NoteType, forId: String) {
        super();

        this.Text = text;
        this.Type = type;
        this.ForId = forId;
    }

    @Column()
    Text: String;

    @Column()
    Type: NoteType;

    @Column()
    ForId: String;

    public UpdateBasicDetails(text: String) {
        this.Text = text;
    }

    public static async FetchAllForId(type: NoteType, forId: String): Promise<Note[]> {
        const repository = AppDataSource.getRepository(Note);

        const all = await repository.find();

        const filtered = all.filter(x => x.Type == type && x.ForId == forId);

        // Sort by chronological order (asc)
        const sorted = filtered.sort((a, b) => a.WhenCreated < b.WhenCreated ? -1 :
            a.WhenCreated > b.WhenCreated ? 1 : 0);

        return sorted;
    }
}