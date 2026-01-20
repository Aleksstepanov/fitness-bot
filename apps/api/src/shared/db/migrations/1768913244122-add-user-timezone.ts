import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserTimezone1768913244122 implements MigrationInterface {
    name = 'AddUserTimezone1768913244122'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "timezone" text NOT NULL DEFAULT 'Europe/Moscow'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "timezone"`);
    }

}
