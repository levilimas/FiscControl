import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTransactionsTable1768593153705 implements MigrationInterface {
    name = 'CreateTransactionsTable1768593153705'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."transactions_type_enum" AS ENUM('INCOME', 'EXPENSE')`);
        await queryRunner.query(`CREATE TYPE "public"."transactions_status_enum" AS ENUM('PENDING', 'COMPLETED')`);
        await queryRunner.query(`CREATE TABLE "transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "account_id" uuid NOT NULL, "type" "public"."transactions_type_enum" NOT NULL, "amount" numeric(15,2) NOT NULL, "description" character varying NOT NULL, "category" character varying, "date" TIMESTAMP NOT NULL, "status" "public"."transactions_status_enum" NOT NULL DEFAULT 'COMPLETED', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "preferences" SET DEFAULT '{"default_context":"PF","notification_enabled":true,"theme":"light"}'`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_49c0d6e8ba4bfb5582000d851f0" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_49c0d6e8ba4bfb5582000d851f0"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "preferences" SET DEFAULT '{"theme": "light", "default_context": "PF", "notification_enabled": true}'`);
        await queryRunner.query(`DROP TABLE "transactions"`);
        await queryRunner.query(`DROP TYPE "public"."transactions_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."transactions_type_enum"`);
    }

}
