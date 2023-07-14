export enum OrderStatus {
    AwaitingPayment,
    AwaitingDispatch,
    Dispatched,
    Cancelled,
    Returned,
}

export const OrderStatusNames = new Map<OrderStatus, string>([
    [ OrderStatus.AwaitingPayment, "Awaiting Payment" ],
    [ OrderStatus.AwaitingDispatch, "Awaiting Dispatch" ],
    [ OrderStatus.Dispatched, "Dispatched" ],
    [ OrderStatus.Cancelled, "Cancelled" ],
    [ OrderStatus.Returned, "Returned" ],
]);