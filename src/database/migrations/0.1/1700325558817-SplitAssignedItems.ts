import { MigrationInterface, QueryRunner } from "typeorm"
import MigrationHelper from "../../../helpers/MigrationHelper"

export class SplitAssignedItems1700325558817 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        MigrationHelper.Up('1700325558817-SplitAssignedItems', '0.1', [
            "01-drop/01-ListingItemsItem",
            "01-drop/02-ListingOrdersOrder",
            "01-drop/03-OrderListingsListing",
        ], queryRunner);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
