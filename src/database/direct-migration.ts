/* eslint-disable prettier/prettier */
import { DataSource } from 'typeorm';
import { CreateInitialSchema1700000000000 } from './migrations/1700000000000-CreateInitialSchema';

async function runMigrationDirectly() {
  console.log('🚀 Starting direct migration...');

  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'student_card_system_user',
    password: process.env.DB_PASSWORD || 'User321',
    database: process.env.DB_NAME || 'student_card_system',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: false,
    logging: true,
  });

  try {
    await dataSource.initialize();
    console.log('✅ Database connected successfully!');

    console.log('📦 Running migration...');
    const migration = new CreateInitialSchema1700000000000();
    await migration.up(dataSource.createQueryRunner());

    console.log('✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await dataSource.destroy();
  }
}

// Charger les variables d'environnement
import * as dotenv from 'dotenv';
dotenv.config();

runMigrationDirectly().catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});