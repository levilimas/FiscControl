import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCategories1769624900000 implements MigrationInterface {
  name = 'CreateCategories1769624900000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."categories_type_enum" AS ENUM('INCOME', 'EXPENSE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "type" "public"."categories_type_enum" NOT NULL, "user_id" uuid NOT NULL, "icon" character varying, "color" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "categories" ADD CONSTRAINT "FK_302d6a784c40590885e34743204" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    // Adiciona colunas na tabela de transações
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD "category_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "FK_d39512354a85273c246f9037422" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP CONSTRAINT "FK_d39512354a85273c246f9037422"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP COLUMN "category_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "categories" DROP CONSTRAINT "FK_302d6a784c40590885e34743204"`,
    );
    await queryRunner.query(`DROP TABLE "categories"`);
    await queryRunner.query(`DROP TYPE "public"."categories_type_enum"`);
  }
}
