export enum ReturnStatus {
    Opened,
    Started,
    ItemPosted,
    ItemReceived,
    Refunded,
    Closed,
}

export const ReturnStatusNames = new Map<ReturnStatus, string>([
    [ ReturnStatus.Opened, "Opened" ],
    [ ReturnStatus.Started, "Started" ],
    [ ReturnStatus.ItemPosted, "Item Posted" ],
    [ ReturnStatus.ItemReceived, "Item Received" ],
    [ ReturnStatus.Refunded, "Refunded" ],
    [ ReturnStatus.Closed, "Closed" ],
]);