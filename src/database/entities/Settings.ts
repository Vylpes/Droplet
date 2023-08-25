import { Column, Entity } from "typeorm";
import BaseEntity from "../../contracts/BaseEntity";
import AppDataSource from "../dataSources/appDataSource";

@Entity()
export class Settings extends BaseEntity {
    constructor(key: string, value: string) {
        super();

        this.Key = key;
        this.Value = value;
    }

    @Column()
    Key: string;

    @Column()
    Value: string;

    public EditBasicDetails(key: string, value: string) {
        this.Key = key;
        this.Value = value;
    }

    public static async FetchOneByKey(key: string): Promise<Settings | null> {
        const repository = AppDataSource.getRepository(Settings);

        const single = await repository.findOne({ where: { Key: key }});

        if (!single) {
            return null;
        }

        return single;
    }
}