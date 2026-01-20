import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1705750000000 implements MigrationInterface {
  name = 'Init1705750000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      create table if not exists _meta (
        id serial primary key,
        created_at timestamptz not null default now()
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`drop table if exists _meta;`);
  }
}
