import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCheckIns1768911201482 implements MigrationInterface {
  name = 'CreateCheckIns1768911201482';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."check_ins_status_enum" AS ENUM('DONE', 'SKIPPED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "check_ins" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "check_in_date" date NOT NULL, "status" "public"."check_ins_status_enum" NOT NULL, "note" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_fac7f27bc829a454ad477c13f62" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_96a15614558fe78433983cd35f" ON "check_ins" ("user_id", "check_in_date") `,
    );
    await queryRunner.query(
      `ALTER TABLE "check_ins" ADD CONSTRAINT "FK_7b8c2fc47cf37006c80fc5e80a9" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "check_ins" DROP CONSTRAINT "FK_7b8c2fc47cf37006c80fc5e80a9"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_96a15614558fe78433983cd35f"`,
    );
    await queryRunner.query(`DROP TABLE "check_ins"`);
    await queryRunner.query(`DROP TYPE "public"."check_ins_status_enum"`);
  }
}
