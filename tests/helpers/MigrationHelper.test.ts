import MigrationHelper from '../../src/helpers/MigrationHelper';
import { QueryRunner } from 'typeorm';
import fs from 'fs';

jest.mock('fs');

describe("Up", () => {
    test("EXPECT queryRunner.query to be called for each query file", () => {
        const migrationName = "exampleMigration";
        const version = "1.0.0";
        const queryFiles = ["query1", "query2"];
        const queryRunner: QueryRunner = {
            query: jest.fn(),
        } as unknown as QueryRunner;

        fs.readFileSync = jest.fn().mockReturnValue(Buffer.from("SELECT * FROM table"));
        process.cwd = jest.fn().mockReturnValue("/project");

        MigrationHelper.Up(migrationName, version, queryFiles, queryRunner);

        expect(fs.readFileSync).toHaveBeenCalledTimes(queryFiles.length);
        expect(fs.readFileSync).toHaveBeenCalledWith("/project/data/1.0.0/exampleMigration/Up/query1.sql");
        expect(fs.readFileSync).toHaveBeenCalledWith("/project/data/1.0.0/exampleMigration/Up/query2.sql");
        expect(queryRunner.query).toHaveBeenCalledTimes(queryFiles.length);
        expect(queryRunner.query).toHaveBeenCalledWith("SELECT * FROM table");
    });
});

describe("Down", () => {
    test("EXPECT queryRunner.query to be called for each query file", () => {
        const migrationName = "exampleMigration";
        const version = "1.0.0";
        const queryFiles = ["query1", "query2"];
        const queryRunner: QueryRunner = {
            query: jest.fn(),
        } as unknown as QueryRunner;

        fs.readFileSync = jest.fn().mockReturnValue(Buffer.from("SELECT * FROM table"));
        process.cwd = jest.fn().mockReturnValue("/project");

        MigrationHelper.Down(migrationName, version, queryFiles, queryRunner);

        expect(fs.readFileSync).toHaveBeenCalledTimes(queryFiles.length);
        expect(fs.readFileSync).toHaveBeenCalledWith("/project/data/1.0.0/exampleMigration/Down/query1.sql");
        expect(fs.readFileSync).toHaveBeenCalledWith("/project/data/1.0.0/exampleMigration/Down/query2.sql");
        expect(queryRunner.query).toHaveBeenCalledTimes(queryFiles.length);
        expect(queryRunner.query).toHaveBeenCalledWith("SELECT * FROM table");
    });
});