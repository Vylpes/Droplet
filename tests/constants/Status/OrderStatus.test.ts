import { OrderStatus, OrderStatusNames } from '../../../src/constants/Status/OrderStatus';

describe('OrderStatusNames', () => {
    test('GIVEN input is AwaitingPayment, EXPECT Awaiting Payment string returned', () => {
        expect(OrderStatusNames.get(OrderStatus.AwaitingPayment)).toBe("Awaiting Payment");
    });

    test('GIVEN input is AwaitingDispatch, EXPECT Awaiting Dispatch string returned', () => {
        expect(OrderStatusNames.get(OrderStatus.AwaitingDispatch)).toBe("Awaiting Dispatch");
    });

    test('GIVEN input is Dispatched, EXPECT Dispatched string returned', () => {
        expect(OrderStatusNames.get(OrderStatus.Dispatched)).toBe("Dispatched");
    });

    test('GIVEN input is Cancelled, EXPECT Cancelled string returned', () => {
        expect(OrderStatusNames.get(OrderStatus.Cancelled)).toBe("Cancelled");
    });

    test('GIVEN input is Returned, EXPECT Returned string returned', () => {
        expect(OrderStatusNames.get(OrderStatus.Returned)).toBe("Returned");
    });
});