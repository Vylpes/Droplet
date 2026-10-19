import { Request } from "express";
import { ItemStatus } from "../../../src/constants/Status/ItemStatus";
import { ListingStatus } from "../../../src/constants/Status/ListingStatus";
import { Item } from "../../../src/database/entities/Item";
import { Listing } from "../../../src/database/entities/Listing";
import End from "../../../src/routes/api/listings/end";
import { createMockRes } from "../../helpers/createMockRes";

describe("API listings end", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("marks the listing unsold and returns linked items to unlisted", async () => {
        const end = new End();
        const listing = new Listing("Widget", "L-1", 10, new Date(), 2);
        listing.Quantity = 1; // partially sold
        const item = new Item("Widget", 0);
        item.ListedQuantity = 1;
        item.Status = ItemStatus.Listed;
        listing.Items = [item];

        jest.spyOn(Listing, "FetchOneById").mockResolvedValue(listing);
        jest.spyOn(listing, "Save").mockResolvedValue(undefined);
        jest.spyOn(item, "Save").mockResolvedValue(undefined);

        const req = { params: { Id: listing.Id } } as unknown as Request;
        const res = createMockRes();

        await end.OnPostAsync(req, res);

        expect(listing.Status).toBe(ListingStatus.Unsold);
        expect(listing.Quantity).toBe(2); // restored OriginalQuantity
        expect(item.UnlistedQuantity).toBe(2); // MarkAsUnlisted uses listing.Quantity after restore
        expect(item.Status).toBe(ItemStatus.Unlisted);
        expect(res.body.IsSuccess).toBe(true);
        expect(res.body.Message).toBe("Listing ended");
    });
});
