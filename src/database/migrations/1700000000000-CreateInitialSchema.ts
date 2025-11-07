/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

export class CreateInitialSchema1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ==================== UNIVERSITIES ====================
    await queryRunner.createTable(
      new Table({
        name: 'universities',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid'},
          { name: 'name', type: 'varchar', length: '50', isNullable: false },
          { name: 'code', type: 'varchar', length: '10', isUnique: true, isNullable: false },
          { name: 'address', type: 'text', isNullable: true },
          { name: 'city', type: 'varchar', length: '30', isNullable: true },
          { name: 'country', type: 'varchar', length: '15', isNullable: true },
          { name: 'phone', type: 'varchar', length: '15', isNullable: true },
          { name: 'email', type: 'varchar', length: '30', isNullable: true },
          { name: 'website', type: 'varchar', length: '30', isNullable: true },
          { name: 'logo_url', type: 'varchar', length: '100', isNullable: true },
          { name: 'academic_year_start', type: 'date', isNullable: true },
          { name: 'academic_year_end', type: 'date', isNullable: true },
          { name: 'is_active', type: 'boolean', default: true },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

    // ==================== ESTABLISHMENT TYPES ====================
    await queryRunner.createTable(
      new Table({
        name: 'establishment_types',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid'},
          { name: 'name', type: 'varchar', length: '10', isNullable: false },
          { name: 'code', type: 'varchar', length: '10', isUnique: true, isNullable: false },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

    // ==================== ESTABLISHMENTS ====================
    await queryRunner.createTable(
      new Table({
        name: 'establishments',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid'},
          { name: 'name', type: 'varchar', length: '10', isNullable: false },
          { name: 'code', type: 'varchar', length: '10', isNullable: false },
          { name: 'type_id', type: 'uuid', isNullable: false },
          { name: 'university_id', type: 'uuid', isNullable: false },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'contact_email', type: 'varchar', length: '20', isNullable: true },
          { name: 'contact_phone', type: 'varchar', length: '15', isNullable: true },
          { name: 'address', type: 'text', isNullable: true },
          { name: 'is_active', type: 'boolean', default: true },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

    // ==================== DOMAINS ====================
    await queryRunner.createTable(
      new Table({
        name: 'domains',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid'},
          { name: 'name', type: 'varchar', length: '10', isNullable: false },
          { name: 'code', type: 'varchar', length: '10', isNullable: false },
          { name: 'establishment_id', type: 'uuid', isNullable: false },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'duration_years', type: 'integer', default: 3 },
          { name: 'is_active', type: 'boolean', default: true },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

    // ==================== COURSES ====================
    await queryRunner.createTable(
      new Table({
        name: 'courses',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid'},
          { name: 'name', type: 'varchar', length: '10', isNullable: false },
          { name: 'code', type: 'varchar', length: '10', isNullable: false },
          { name: 'domain_id', type: 'uuid', isNullable: false },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'tuition_fee', type: 'decimal', precision: 10, scale: 2, default: 0 },
          { name: 'is_active', type: 'boolean', default: true },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

    // ==================== COURSE LEVELS ====================
    await queryRunner.createTable(
      new Table({
        name: 'course_levels',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid'},
          { name: 'course_id', type: 'uuid', isNullable: false },
          { name: 'level', type: 'enum', enum: ['license', 'master', 'doctorat', 'engineering'], isNullable: false },
          { name: 'academic_year', type: 'varchar', length: '9', isNullable: false },
          { name: 'credits_required', type: 'integer', default: 60 },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

    // ==================== USERS ====================
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid'},
          { name: 'email', type: 'varchar', length: '30', isUnique: true, isNullable: false },
          { name: 'password', type: 'varchar', length: '20', isNullable: false },
          { name: 'first_name', type: 'varchar', length: '10', isNullable: false },
          { name: 'last_name', type: 'varchar', length: '10', isNullable: false },
          { name: 'phone', type: 'varchar', length: '15', isNullable: true },
          { name: 'role', type: 'enum', enum: ['super_admin', 'university_admin', 'establishment_admin', 'student', 'cashier', 'professor'], default: "'student'" },
          { name: 'is_active', type: 'boolean', default: true },
          { name: 'last_login', type: 'timestamp', isNullable: true },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

    // ==================== STUDENTS ====================
    await queryRunner.createTable(
      new Table({
        name: 'students',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid'},
          { name: 'student_id', type: 'varchar', length: '10', isUnique: true, isNullable: false },
          { name: 'user_id', type: 'uuid', isNullable: false },
          { name: 'course_id', type: 'uuid', isNullable: false },
          { name: 'date_of_birth', type: 'date', isNullable: true },
          { name: 'gender', type: 'enum', enum: ['male', 'female', 'other'], isNullable: true },
          { name: 'nationality', type: 'varchar', length: '30', isNullable: true },
          { name: 'cin', type: 'varchar', length: '15', isNullable: true },
          { name: 'address', type: 'text', isNullable: true },
          { name: 'city', type: 'varchar', length: '40', isNullable: true },
          { name: 'postal_code', type: 'varchar', length: '5', isNullable: true },
          { name: 'emergency_contact_name', type: 'varchar', length: '30', isNullable: true },
          { name: 'emergency_contact_phone', type: 'varchar', length: '20', isNullable: true },
          { name: 'emergency_contact_relation', type: 'varchar', length: '20', isNullable: true },
          { name: 'enrollment_year', type: 'varchar', length: '9', isNullable: false },
          { name: 'current_year', type: 'integer', default: 1 },
          { name: 'registration_date', type: 'date', isNullable: false },
          { name: 'expected_graduation_date', type: 'date', isNullable: true },
          { name: 'status', type: 'enum', enum: ['active', 'inactive', 'suspended', 'graduated', 'dropout', 'academic_leave'], default: "'active'" },
          { name: 'photo_url', type: 'varchar', length: '500', isNullable: true },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

    // ==================== STUDENT CARDS ====================
    await queryRunner.createTable(
      new Table({
        name: 'student_cards',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid'},
          { name: 'card_number', type: 'varchar', length: '6', isUnique: true, isNullable: false },
          { name: 'student_id', type: 'uuid', isNullable: false },
          { name: 'issue_date', type: 'date', isNullable: false },
          { name: 'expiration_date', type: 'date', isNullable: false },
          { name: 'balance', type: 'decimal', precision: 10, scale: 2, default: 0 },
          { name: 'status', type: 'enum', enum: ['active', 'inactive', 'blocked', 'lost', 'stolen', 'expired'], default: "'active'" },
          { name: 'pin_hash', type: 'varchar', length: '50', isNullable: true },
          { name: 'last_used', type: 'timestamp', isNullable: true },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

    // ==================== TRANSACTIONS ====================
    await queryRunner.createTable(
      new Table({
        name: 'transactions',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid'},
          { name: 'card_id', type: 'uuid', isNullable: false },
          { name: 'amount', type: 'decimal', precision: 10, scale: 2, isNullable: false },
          { name: 'transaction_type', type: 'enum', enum: ['payment', 'recharge', 'refund', 'withdrawal'], isNullable: false },
          { name: 'merchant', type: 'varchar', length: '30', isNullable: true },
          { name: 'location', type: 'varchar', length: '50', isNullable: true },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'previous_balance', type: 'decimal', precision: 10, scale: 2, isNullable: false },
          { name: 'new_balance', type: 'decimal', precision: 10, scale: 2, isNullable: false },
          { name: 'status', type: 'enum', enum: ['pending', 'completed', 'failed', 'cancelled'], default: "'completed'" },
          { name: 'transaction_date', type: 'timestamp', default: 'now()' },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

    // ==================== ESTABLISHMENT DIRECTORS ====================
    await queryRunner.createTable(
      new Table({
        name: 'establishment_directors',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid'},
          { name: 'establishment_id', type: 'uuid', isNullable: false },
          { name: 'user_id', type: 'uuid', isNullable: false },
          { name: 'start_date', type: 'date', isNullable: true },
          { name: 'end_date', type: 'date', isNullable: true },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

    // ==================== SERVICES ====================
    await queryRunner.createTable(
      new Table({
        name: 'services',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid'},
          { name: 'name', type: 'varchar', length: '20', isNullable: false },
          { name: 'code', type: 'varchar', length: '10', isUnique: true, isNullable: false },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'establishment_id', type: 'uuid', isNullable: false },
          { name: 'cost', type: 'decimal', precision: 10, scale: 2, default: 0 },
          { name: 'is_active', type: 'boolean', default: true },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

    // ==================== DONNÉES DE RÉFÉRENCE ====================
    const facTypeId = uuidv4();
    const ecoTypeId = uuidv4();
    const insTypeId = uuidv4();

    // Insérer les types d'établissements avec UUID générés côté application
    await queryRunner.query(`
      INSERT INTO establishment_types (id, name, code, description) VALUES
      ('${facTypeId}', 'Faculté', 'FAC', 'Établissement universitaire de type faculté'),
      ('${ecoTypeId}', 'École', 'ECO', 'Établissement universitaire de type école'),
      ('${insTypeId}', 'Institut', 'INS', 'Établissement universitaire de type institut')
      ON CONFLICT (code) DO NOTHING;
    `);

    console.log('✅ Reference data inserted successfully!');

    // ==================== FOREIGN KEYS ====================
    await queryRunner.createForeignKey('establishments', new TableForeignKey({ columnNames: ['university_id'], referencedColumnNames: ['id'], referencedTableName: 'universities', onDelete: 'CASCADE' }));
    await queryRunner.createForeignKey('establishments', new TableForeignKey({ columnNames: ['type_id'], referencedColumnNames: ['id'], referencedTableName: 'establishment_types', onDelete: 'RESTRICT' }));
    await queryRunner.createForeignKey('domains', new TableForeignKey({ columnNames: ['establishment_id'], referencedColumnNames: ['id'], referencedTableName: 'establishments', onDelete: 'CASCADE' }));
    await queryRunner.createForeignKey('courses', new TableForeignKey({ columnNames: ['domain_id'], referencedColumnNames: ['id'], referencedTableName: 'domains', onDelete: 'CASCADE' }));
    await queryRunner.createForeignKey('course_levels', new TableForeignKey({ columnNames: ['course_id'], referencedColumnNames: ['id'], referencedTableName: 'courses', onDelete: 'CASCADE' }));
    await queryRunner.createForeignKey('students', new TableForeignKey({ columnNames: ['user_id'], referencedColumnNames: ['id'], referencedTableName: 'users', onDelete: 'CASCADE' }));
    await queryRunner.createForeignKey('students', new TableForeignKey({ columnNames: ['course_id'], referencedColumnNames: ['id'], referencedTableName: 'courses', onDelete: 'RESTRICT' }));
    await queryRunner.createForeignKey('student_cards', new TableForeignKey({ columnNames: ['student_id'], referencedColumnNames: ['id'], referencedTableName: 'students', onDelete: 'CASCADE' }));
    await queryRunner.createForeignKey('transactions', new TableForeignKey({ columnNames: ['card_id'], referencedColumnNames: ['id'], referencedTableName: 'student_cards', onDelete: 'RESTRICT' }));
    await queryRunner.createForeignKey('services', new TableForeignKey({ columnNames: ['establishment_id'], referencedColumnNames: ['id'], referencedTableName: 'establishments', onDelete: 'CASCADE' }));
    await queryRunner.createForeignKey('establishment_directors', new TableForeignKey({ columnNames: ['establishment_id'], referencedColumnNames: ['id'], referencedTableName: 'establishments', onDelete: 'CASCADE' }));
    await queryRunner.createForeignKey('establishment_directors', new TableForeignKey({ columnNames: ['user_id'], referencedColumnNames: ['id'], referencedTableName: 'users', onDelete: 'CASCADE' }));

    // ==================== INDEXES ====================
    await queryRunner.createIndex('establishments', new TableIndex({ name: 'IDX_ESTABLISHMENT_TYPE', columnNames: ['type_id'] }));
    await queryRunner.createIndex('establishments', new TableIndex({ name: 'IDX_ESTABLISHMENT_UNIVERSITY', columnNames: ['university_id'] }));
    await queryRunner.createIndex('domains', new TableIndex({ name: 'IDX_DOMAIN_ESTABLISHMENT', columnNames: ['establishment_id'] }));
    await queryRunner.createIndex('courses', new TableIndex({ name: 'IDX_COURSE_DOMAIN', columnNames: ['domain_id'] }));
    await queryRunner.createIndex('course_levels', new TableIndex({ name: 'IDX_COURSE_LEVEL_COURSE', columnNames: ['course_id'] }));
    await queryRunner.createIndex('students', new TableIndex({ name: 'IDX_STUDENT_COURSE', columnNames: ['course_id'] }));
    await queryRunner.createIndex('students', new TableIndex({ name: 'IDX_STUDENT_STATUS', columnNames: ['status'] }));
    await queryRunner.createIndex('student_cards', new TableIndex({ name: 'IDX_CARD_STATUS', columnNames: ['status'] }));
    await queryRunner.createIndex('transactions', new TableIndex({ name: 'IDX_TRANSACTION_DATE', columnNames: ['transaction_date'] }));
    await queryRunner.createIndex('establishment_directors', new TableIndex({ name: 'IDX_DIRECTOR_ESTABLISHMENT', columnNames: ['establishment_id'] }));
    await queryRunner.createIndex('services', new TableIndex({ name: 'IDX_SERVICE_ESTABLISHMENT', columnNames: ['establishment_id'] }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Supprimer les clés étrangères d'abord
    const foreignKeys = [
      'establishments_university_id_fkey', 'establishments_type_id_fkey',
      'domains_establishment_id_fkey', 'courses_domain_id_fkey',
      'course_levels_course_id_fkey', 'students_user_id_fkey',
      'students_course_id_fkey', 'student_cards_student_id_fkey',
      'transactions_card_id_fkey', 'services_establishment_id_fkey',
      'establishment_directors_establishment_id_fkey', 'establishment_directors_user_id_fkey'
    ];

    for (const fk of foreignKeys) {
      try {
        await queryRunner.dropForeignKey('establishments', fk);
      } catch (error) {
        // Ignorer si la clé n'existe pas
      }
    }

    // Supprimer les tables dans l'ordre inverse
    await queryRunner.dropTable('transactions');
    await queryRunner.dropTable('student_cards');
    await queryRunner.dropTable('students');
    await queryRunner.dropTable('services');
    await queryRunner.dropTable('establishment_directors');
    await queryRunner.dropTable('course_levels');
    await queryRunner.dropTable('courses');
    await queryRunner.dropTable('domains');
    await queryRunner.dropTable('establishments');
    await queryRunner.dropTable('establishment_types');
    await queryRunner.dropTable('users');
    await queryRunner.dropTable('universities');
  }
}