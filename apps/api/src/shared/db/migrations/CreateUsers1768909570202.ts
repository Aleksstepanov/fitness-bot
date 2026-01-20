import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsers1768909570202 implements MigrationInterface {
  name = 'CreateUsers1768909570202';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    await queryRunner.query(`
    CREATE TABLE "users" (
      "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
      "tg_id" bigint NOT NULL,
      "username" text,
      "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
      CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
    )
  `);

    await queryRunner.query(`
    CREATE UNIQUE INDEX "IDX_9793d2defd72fffdb9a55c0d88"
    ON "users" ("tg_id")
  `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9793d2defd72fffdb9a55c0d88"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
