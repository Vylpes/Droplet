import { MigrationInterface, QueryRunner } from "typeorm"
import MigrationHelper from "../../../helpers/MigrationHelper"

export class CreateSession1662137215916 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        MigrationHelper.Up('1662137215916-CreateSession', '0.1', [
            "Session"
        ], queryRunner);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        MigrationHelper.Down('1662137215916-CreateSession', '0.1', [
            "Session"
        ], queryRunner);
    }

}
