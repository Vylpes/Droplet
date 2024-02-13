import { ReturnStatus, ReturnStatusNames } from '../../../src/constants/Status/ReturnStatus';

describe('ReturnStatusNames', () => {
    test('GIVEN input is Opened, EXPECT Opened string returned', () => {
        expect(ReturnStatusNames.get(ReturnStatus.Opened)).toBe("Opened");
    });

    test('GIVEN input is Started, EXPECT Started string returned', () => {
        expect(ReturnStatusNames.get(ReturnStatus.Started)).toBe("Started");
    });

    test('GIVEN input is ItemPosted, EXPECT Item Posted string returned', () => {
        expect(ReturnStatusNames.get(ReturnStatus.ItemPosted)).toBe("Item Posted");
    });

    test('GIVEN input is ItemReceived, EXPECT Item Received string returned', () => {
        expect(ReturnStatusNames.get(ReturnStatus.ItemReceived)).toBe("Item Received");
    });

    test('GIVEN input is Refunded, EXPECT Refunded string returned', () => {
        expect(ReturnStatusNames.get(ReturnStatus.Refunded)).toBe("Refunded");
    });

    test('GIVEN input is Closed, EXPECT Closed string returned', () => {
        expect(ReturnStatusNames.get(ReturnStatus.Closed)).toBe("Closed");
    });
});