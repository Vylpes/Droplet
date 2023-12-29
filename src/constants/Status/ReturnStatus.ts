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

export const ReturnStatusParse = new Map<string, ReturnStatus>([
    [ "opened", ReturnStatus.Opened ],
    [ "started", ReturnStatus.Started ],
    [ "item-posted", ReturnStatus.ItemPosted ],
    [ "item-received", ReturnStatus.ItemReceived ],
    [ "refunded", ReturnStatus.Refunded ],
    [ "closed", ReturnStatus.Closed ],
]);