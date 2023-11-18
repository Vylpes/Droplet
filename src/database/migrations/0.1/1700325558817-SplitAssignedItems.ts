import { MigrationInterface, QueryRunner } from "typeorm"
import MigrationHelper from "../../../helpers/MigrationHelper"

export class SplitAssignedItems1700325558817 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        MigrationHelper.Up('1700325558817-SplitAssignedItems', '0.1', [
            "01-create/01-ListingItem",
            "01-create/02-OrderListing",

            "02-insert/01-ListingItem",
            "02-insert/02-OrderListing",

            "03-drop/01-ListingItemsItem",
            "03-drop/02-ListingOrdersOrder",
            "03-drop/03-OrderListingsListing",
        ], queryRunner);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
