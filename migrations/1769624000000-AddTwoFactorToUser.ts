import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTwoFactorToUser1769624000000 implements MigrationInterface {
    name = 'AddTwoFactorToUser1769624000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "two_factor_secret" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "is_two_factor_enabled" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "is_two_factor_enabled"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "two_factor_secret"`);
    }

}
