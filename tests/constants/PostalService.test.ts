import { PostalService, PostalServiceNames } from '../../src/constants/PostalService';

describe('PostalServiceNames', () => {
    test('GIVEN input is RoyalMail, EXPECT Royal Mail string returned', () => {
        expect(PostalServiceNames.get(PostalService.RoyalMail)).toBe("Royal Mail");
    });

    test('GIVEN input is Hermes, EXPECT Hermes string returned', () => {
        expect(PostalServiceNames.get(PostalService.Hermes)).toBe("Hermes");
    });
});