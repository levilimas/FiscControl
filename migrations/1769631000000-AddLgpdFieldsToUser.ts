import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddLgpdFieldsToUser1769631000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('users', [
      new TableColumn({
        name: 'birth_date',
        type: 'date',
        isNullable: true,
      }),
      new TableColumn({
        name: 'terms_accepted_at',
        type: 'timestamp',
        isNullable: true,
      }),
      new TableColumn({
        name: 'privacy_policy_accepted_at',
        type: 'timestamp',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'privacy_policy_accepted_at');
    await queryRunner.dropColumn('users', 'terms_accepted_at');
    await queryRunner.dropColumn('users', 'birth_date');
  }
}
