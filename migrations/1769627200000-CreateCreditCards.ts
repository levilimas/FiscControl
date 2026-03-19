import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCreditCards1769627200000 implements MigrationInterface {
  name = 'CreateCreditCards1769627200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "credit_cards" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "user_id" uuid NOT NULL, "limit" numeric(15,2) NOT NULL, "closing_day" integer NOT NULL, "due_day" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_credit_cards_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "credit_cards" ADD CONSTRAINT "FK_credit_cards_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    // Alterar tabela de transações
    await queryRunner.query(
      `ALTER TABLE "transactions" ALTER COLUMN "account_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD "credit_card_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD "installment_number" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD "total_installments" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "FK_transactions_credit_card" FOREIGN KEY ("credit_card_id") REFERENCES "credit_cards"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP CONSTRAINT "FK_transactions_credit_card"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP COLUMN "total_installments"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP COLUMN "installment_number"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP COLUMN "credit_card_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ALTER COLUMN "account_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "credit_cards" DROP CONSTRAINT "FK_credit_cards_user"`,
    );
    await queryRunner.query(`DROP TABLE "credit_cards"`);
  }
}
