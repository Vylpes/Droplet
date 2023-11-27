import tingodb, { Collection, Db } from "tingodb";

export default class ConnectionHelper {
    public static DbConnection: Db;

    public static OpenConnection(path: string) {
        const Db = tingodb().Db;
        this.DbConnection = new Db(path, {});
    }

    public static GetCollection<T>(name: string): Collection<T> {
        return this.DbConnection.collection<T>(name);
    }

    public static async Insert<T>(collectionName: string, value: T): Promise<void> {
        const collection = this.GetCollection<T>(collectionName);

        await collection.insert([value]);
    }

    public static async InsertMultiple<T>(collectionName: string, values: T[]): Promise<void> {
        const collection = this.GetCollection<T>(collectionName);

        await collection.insert(values);
    }

    public static async Find<T>(collectionName: string, filter?: any): Promise<T[]> {
        return new Promise((resolve, reject) => {
            const collection = this.GetCollection<T>(collectionName);

            collection.find(filter, (err: any, items: any) => {
                if (err) {
                    reject();
                    return;
                }

                items.toArray((err: any, items: T[]) => {
                    if (err) {
                        reject();
                        return;
                    }

                    resolve(items);
                });
            });
        })
    }

    public static async FindOne<T>(collectionName: string, filter: any): Promise<T> {
        return new Promise((resolve, reject) => {
            const collecton = this.GetCollection<T>(collectionName);

            collecton.findOne(filter, (err: any, item: T) => {
                if (err) {
                    reject();
                    return;
                }

                resolve(item);
            });
        });
    }
}