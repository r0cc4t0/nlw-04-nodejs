import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateSurveysUsers1618766723410 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'surveys_users',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          isPrimary: true
        },
        {
          name: 'user_id',
          type: 'uuid',
        },
        {
          name: 'survey_id',
          type: 'uuid'
        },
        {
          name: 'value',
          type: 'number',
          isNullable: true
        },
        {
          name: 'created_at',
          type: 'timestamp',
          default: 'now()'
        }
      ],
      foreignKeys: [
        {
          name: 'user_fk',
          referencedTableName: 'users',
          referencedColumnNames: ['id'],
          columnNames: ['user_id'],
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        {
          name: 'survey_fk',
          referencedTableName: 'surveys',
          referencedColumnNames: ['id'],
          columnNames: ['survey_id'],
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        }
      ]
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('surveys_users');
  }

}
