import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddCurrencyToAccount1769630000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'accounts',
      new TableColumn({
        name: 'currency',
        type: 'varchar',
        default: "'BRL'",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('accounts', 'currency');
  }
}
