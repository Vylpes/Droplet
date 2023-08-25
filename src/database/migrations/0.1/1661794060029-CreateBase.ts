import { readFileSync } from "fs"
import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateBase1661794060029 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        var queryFiles = [
            "01-table/Item",
            "01-table/ItemPurchase",
            "01-table/Listing",
            "01-table/ListingItemsItem",
            "01-table/ListingOrdersOrder",
            "01-table/Note",
            "01-table/Order",
            "01-table/OrderListingsListing",
            "01-table/OrderSuppliesSupply",
            "01-table/PostagePolicy",
            "01-table/Return",
            "01-table/Settings",
            "01-table/Storage",
            "01-table/Supply",
            "01-table/SupplyPurchase",
            "01-table/TrackingNumber",
            "01-table/User",
            "01-table/UserToken",
            
            "02-index/Item",
            "02-index/ItemPurchase",
            "02-index/Listing",
            "02-index/ListingItemsItem",
            "02-index/ListingOrdersOrder",
            "02-index/Note",
            "02-index/Order",
            "02-index/OrderListingsListing",
            "02-index/OrderSuppliesSupply",
            "02-index/PostagePolicy",
            "02-index/Return",
            "02-index/Settings",
            "02-index/Storage",
            "02-index/Supply",
            "02-index/SupplyPurchase",
            "02-index/TrackingNumber",
            "02-index/User",
            "02-index/UserToken",

            "03-constraint/Item",
            "03-constraint/Listing",
            "03-constraint/ListingItemsItem",
            "03-constraint/ListingOrdersOrder",
            "03-constraint/Order",
            "03-constraint/OrderListingsListing",
            "03-constraint/OrderSuppliesSupply",
            "03-constraint/Return",
            "03-constraint/Storage",
            "03-constraint/Supply",
            "03-constraint/TrackingNumber",
            "03-constraint/UserToken",
        ]

        for (let path of queryFiles) {
            const query = readFileSync(`${process.cwd()}/data/0.1/1661794060029-CreateBase/${path}.sql`).toString();

            queryRunner.query(query);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
