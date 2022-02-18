import { Column, Entity, getConnection, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";
import { ItemStatus } from "../constants/Status/ItemStatus";
import BaseEntity from "../contracts/BaseEntity";
import { ItemPurchase } from "./ItemPurchase";
import { Listing } from "./Listing";
import { Return } from "./Return";
import { Storage } from "./Storage";

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
        const connection = getConnection();

        const repository = connection.getRepository(Settings);

        const single = await repository.findOne({ Key: key });

        if (!single) {
            return null;
        }

        return single;
    }
}