import { Request, Response, Router } from "express";
import { ItemStatus } from "../../constants/Status/ItemStatus";
import { Page } from "../../contracts/Page";
import { UserMiddleware } from "../../middleware/userMiddleware";
import ConnectionHelper from "../../helpers/ConnectionHelper";
import Listing from "../../contracts/entities/Listing/Listing";
import { ListingStatus } from "../../constants/Status/ListingStatus";
import ItemPurchase from "../../contracts/entities/ItemPurchase/ItemPurchase";
import { CalculateStatus } from "../../contracts/entities/ItemPurchase/Item";

export default class End extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        super.router.post('/view/:Id/end', UserMiddleware.Authorise, async (req: Request, res: Response) => {
            const Id = req.params.Id;

            const listingMaybe = await ConnectionHelper.FindOne<Listing>("listing", { uuid: Id });

            if (!listingMaybe.IsSuccess) {
                res.redirect('/listings/active');
                return;
            }

            const listing = listingMaybe.Value!;

            await ConnectionHelper.UpdateOne<Listing>("listing", { uuid: Id }, { $set: { status: ListingStatus.Unsold } });

            const itemPurchases: ItemPurchase[] = [];

            for (const itemId of listing.r_items) {
                let itemPurchase = itemPurchases.find(x => x.items.find(y => y.uuid == itemId));

                if (itemPurchase) {
                    const item = itemPurchase.items.find(x => x.uuid == itemId);

                    item.quantities.unlisted += listing.quantities.left;
                    item.quantities.listed -= listing.quantities.left;
                    item.status = CalculateStatus(item);

                    await ConnectionHelper.UpdateOne<ItemPurchase>("item-purchase", { uuid: itemPurchase.uuid, items: { uuid: item.uuid } }, { $set: { 'items.$': item } });

                    continue;
                }

                itemPurchase = (await ConnectionHelper.FindOne<ItemPurchase>("item-purchase", { items: { uuid: itemId } })).Value!;
                itemPurchases.push(itemPurchase);

                const item = itemPurchase.items.find(x => x.uuid == itemId);

                item.quantities.unlisted += listing.quantities.left;
                item.quantities.listed -= listing.quantities.left;
                item.status = CalculateStatus(item);

                await ConnectionHelper.UpdateOne<ItemPurchase>("item-purchase", { uuid: itemPurchase.uuid, items: { uuid: item.uuid } }, { $set: { 'items.$': item } });
            }

            res.redirect('/listings/active');
        });
    }
}