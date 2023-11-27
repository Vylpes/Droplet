declare module 'tingodb' {
    export default function Tingodb(): {
        Db: any,
    }

    export declare class Db {
        constructor(path: string, options: DbOptions);
        collection<T>(name: string): Collection<T>;
    }

    export declare class Collection<T> {
        insert(values: T[]);
        find(filter: any, callback: Function<any, any>);
        findOne(filter: any, callback: Function<any, any>);
    }
}