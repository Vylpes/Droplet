import { Column, EntityTarget, getConnection, PrimaryColumn } from "typeorm";
import { v4 } from "uuid";

export default class BaseEntity {
    constructor() {
        this.Id = v4();
        
        this.WhenCreated = new Date();
        this.WhenUpdated = new Date();
    }

    @PrimaryColumn()
    Id: string;

    @Column()
    WhenCreated: Date;

    @Column()
    WhenUpdated: Date;

    public async Save<T>(target: EntityTarget<T>, entity: T): Promise<void> {
        this.WhenUpdated = new Date();

        const connection = getConnection();

        const repository = connection.getRepository<T>(target);

        await repository.save(entity);
    }

    public static async FetchAll<T>(target: EntityTarget<T>, relations?: string[]): Promise<T[]> {
        const connection = getConnection();

        const repository = connection.getRepository<T>(target);

        const all = await repository.find({ relations: relations || [] });

        return all;
    }

    public static async FetchOneById<T>(target: EntityTarget<T>, id: string, relations?: string[]): Promise<T> {
        const connection = getConnection();

        const repository = connection.getRepository<T>(target);

        const single = await repository.findOne(id, { relations: relations || [] });

        return single;
    }
}