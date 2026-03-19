import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateHabitsAndHabitLogs1769710000000
  implements MigrationInterface
{
  name = 'CreateHabitsAndHabitLogs1769710000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."habits_frequency_enum" AS ENUM('DAILY', 'WEEKLY', 'MONTHLY')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."habits_difficulty_enum" AS ENUM('EASY', 'MEDIUM', 'HARD', 'EPIC')`,
    );
    await queryRunner.query(
      `CREATE TABLE "habits" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying, "frequency" "public"."habits_frequency_enum" NOT NULL DEFAULT 'DAILY', "difficulty" "public"."habits_difficulty_enum" NOT NULL DEFAULT 'MEDIUM', "streak" integer NOT NULL DEFAULT '0', "total_xp" integer NOT NULL DEFAULT '0', "user_id" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_habits_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "habit_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" date NOT NULL, "xp_earned" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "habit_id" uuid, CONSTRAINT "PK_habit_logs_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "habits" ADD CONSTRAINT "FK_habits_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "habit_logs" ADD CONSTRAINT "FK_habit_logs_habit" FOREIGN KEY ("habit_id") REFERENCES "habits"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "habit_logs" DROP CONSTRAINT "FK_habit_logs_habit"`,
    );
    await queryRunner.query(
      `ALTER TABLE "habits" DROP CONSTRAINT "FK_habits_user"`,
    );
    await queryRunner.query(`DROP TABLE "habit_logs"`);
    await queryRunner.query(`DROP TABLE "habits"`);
    await queryRunner.query(`DROP TYPE "public"."habits_difficulty_enum"`);
    await queryRunner.query(`DROP TYPE "public"."habits_frequency_enum"`);
  }
}
