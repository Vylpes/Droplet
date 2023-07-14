export enum PostalService {
    RoyalMail,
    Hermes,
}

export const PostalServiceNames = new Map<PostalService, string>([
    [ PostalService.RoyalMail, "Royal Mail" ],
    [ PostalService.Hermes, "Hermes" ],
]);