import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateGoals1769625300000 implements MigrationInterface {
  name = 'CreateGoals1769625300000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "goals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "category_id" uuid NOT NULL, "amount" numeric(15,2) NOT NULL, "month" integer NOT NULL, "year" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_552719747530666014523924372" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "goals" ADD CONSTRAINT "FK_c9233620803c40590885e34743204" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "goals" ADD CONSTRAINT "FK_985219747530666014523924372" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "goals" DROP CONSTRAINT "FK_985219747530666014523924372"`,
    );
    await queryRunner.query(
      `ALTER TABLE "goals" DROP CONSTRAINT "FK_c9233620803c40590885e34743204"`,
    );
    await queryRunner.query(`DROP TABLE "goals"`);
  }
}
