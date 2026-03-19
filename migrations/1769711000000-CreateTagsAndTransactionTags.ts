import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTagsAndTransactionTags1769711000000
  implements MigrationInterface
{
  name = 'CreateTagsAndTransactionTags1769711000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "tags" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "color" character varying, "user_id" uuid NOT NULL, CONSTRAINT "PK_tags_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "tags" ADD CONSTRAINT "FK_tags_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `CREATE TABLE "transaction_tags" ("transaction_id" uuid NOT NULL, "tag_id" uuid NOT NULL, CONSTRAINT "PK_transaction_tags" PRIMARY KEY ("transaction_id", "tag_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_transaction_tags_transaction_id" ON "transaction_tags" ("transaction_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_transaction_tags_tag_id" ON "transaction_tags" ("tag_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_tags" ADD CONSTRAINT "FK_transaction_tags_transaction" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_tags" ADD CONSTRAINT "FK_transaction_tags_tag" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction_tags" DROP CONSTRAINT "FK_transaction_tags_tag"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_tags" DROP CONSTRAINT "FK_transaction_tags_transaction"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_transaction_tags_tag_id"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_transaction_tags_transaction_id"`,
    );
    await queryRunner.query(`DROP TABLE "transaction_tags"`);

    await queryRunner.query(`ALTER TABLE "tags" DROP CONSTRAINT "FK_tags_user"`);
    await queryRunner.query(`DROP TABLE "tags"`);
  }
}
