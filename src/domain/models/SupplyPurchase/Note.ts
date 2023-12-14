export interface Note {
    uuid: string,
    comment: string,
    whenCreated: Date,
    author: {
        r_userId: string,
        username: string,
    }
}