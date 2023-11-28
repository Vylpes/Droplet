export interface INote {
    uuid: string,
    comment: string,
    whenCreated: Date,
    author: {
        r_userId: string,
        username: string,
    }
}