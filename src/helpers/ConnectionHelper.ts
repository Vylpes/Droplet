import { Result } from "../contracts/Result";
import IBaseEntity from "../contracts/IBaseEntity";
import { MongoClient, Db, Collection, OptionalUnlessRequiredId, WithId, Filter, UpdateFilter } from "mongodb";

export default class ConnectionHelper {
    public static Client: MongoClient;
    public static DbConnection: Db;

    public static async OpenConnection(url: string, database: string) {
        this.Client = new MongoClient(url);
        await this.Client.connect();

        this.DbConnection = this.Client.db(database);
    }

    public static GetCollection<T>(name: string): Result<Collection<T>> {
        try {
            return Result.Ok(this.DbConnection.collection<T>(name));
        } catch (error) {
            console.error(error);
            return Result.Fail(error);
        }
    }

    public static async InsertOne<T>(collectionName: string, value: OptionalUnlessRequiredId<T>): Promise<Result<void>> {
        try {
            const collection = this.GetCollection<T>(collectionName);

            await collection.Value.insertOne(value);

            return Result.Ok<void>(undefined);
        } catch (error) {
            console.error(error);
            return Result.Fail(error);
        }
    }

    public static async InsertMultiple<T>(collectionName: string, values: OptionalUnlessRequiredId<T>[]): Promise<Result<void>> {
        try {
            const collection = this.GetCollection<T>(collectionName);

            await collection.Value.insertMany(values)

            return Result.Ok<void>(undefined);
        } catch (error) {
            console.error(error);
            return Result.Fail(error);
        }
    }

    public static async FindOne<T>(collectionName: string, filter?: Filter<T>): Promise<Result<WithId<T>>> {
        try {
            const collection = this.GetCollection<T>(collectionName);
            const item = await collection.Value.findOne(filter);

            return Result.Ok(item);
        } catch (error) {
            console.error(error);
            return Result.Fail(error);
        }
    }

    public static async FindMultiple<T>(collectionName: string, filter: Filter<T>): Promise<Result<WithId<T>[]>> {
        try {
            const collection = this.GetCollection<T>(collectionName);
            const items = collection.Value.find(filter);

            return Result.Ok(await items.toArray());
        } catch (error) {
            console.error(error);
            return Result.Fail(error);
        }
    }

    public static async UpdateOne<T>(collectionName: string, filter: Filter<T>, update: UpdateFilter<T> | Partial<T>): Promise<Result<void>> {
        try {
            const collection = this.GetCollection<T>(collectionName);

            await collection.Value.updateOne(filter, update);

            return Result.Ok<void>(undefined);
        } catch (error) {
            console.error(error);
            return Result.Fail(error);
        }
    }

    public static async DeleteOne<T>(collectionName: string, filter: T): Promise<Result<void>> {
        try {
            const collection = this.GetCollection<T>(collectionName);

            await collection.Value.deleteOne(filter);

            return Result.Ok<void>(undefined);
        } catch (error) {
            console.error(error);
            return Result.Fail(error);
        }
    }

    public static async Any<T>(collectionName: string): Promise<Result<boolean>> {
        try {
            const collection = this.GetCollection<T>(collectionName);

            const count = await collection.Value.countDocuments();

            return Result.Ok<boolean>(count > 0);
        } catch (error) {
            console.error(error);
            return Result.Fail(error);
        }
    }
}