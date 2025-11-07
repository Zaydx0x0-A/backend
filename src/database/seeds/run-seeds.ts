/* eslint-disable prettier/prettier */

import * as bcrypt from 'bcryptjs';
import dataSource from '../data-source';

async function runSeeds() {
  try {
    await dataSource.initialize();
    console.log('📦 Starting database seeds...');

    // ==================== DONNÉES DE RÉFÉRENCE ====================

    // 1. Insérer les types d'établissements
    console.log('🏛️  Inserting establishment types...');
    await dataSource.query(`
      INSERT INTO establishment_types (id, name, code, description) VALUES
      (uuid_generate_v4(), 'Faculté', 'FAC', 'Établissement universitaire de type faculté'),
      (uuid_generate_v4(), 'École', 'ECO', 'Établissement universitaire de type école'),
      (uuid_generate_v4(), 'Institut', 'INS', 'Établissement universitaire de type institut')
      ON CONFLICT (code) DO NOTHING;
    `);

    // 2. Créer une université
    console.log('🎓 Inserting universities...');
    await dataSource.query(`
      INSERT INTO universities (id, name, code, address, city, country, phone, email, website, academic_year_start, academic_year_end) 
      VALUES 
      (
        uuid_generate_v4(), 
        'Université de Technologie Moderne', 
        'UTM', 
        '123 Avenue de la Technologie',
        'Technopolis',
        'France',
        '+33123456789',
        'contact@utm.edu',
        'https://utm.edu',
        '2024-09-01',
        '2025-06-30'
      ),
      (
        uuid_generate_v4(),
        'Université des Sciences Avancées',
        'USA',
        '456 Boulevard des Sciences',
        'Scientia',
        'France', 
        '+33123456780',
        'info@usa.edu',
        'https://usa.edu',
        '2024-09-01',
        '2025-06-30'
      )
      ON CONFLICT (code) DO NOTHING;
    `);

    // 3. Créer des établissements (Facultés, Écoles, Instituts)
    console.log('🏫 Inserting establishments...');
    await dataSource.query(`
      INSERT INTO establishments (id, name, code, type_id, university_id, description, contact_email, contact_phone, address)
      SELECT 
        uuid_generate_v4(),
        establishment_data.name,
        establishment_data.code,
        et.id,
        u.id,
        establishment_data.description,
        establishment_data.contact_email,
        establishment_data.contact_phone,
        establishment_data.address
      FROM (
        VALUES 
          ('Faculté Sciences', 'FAC-SCI', 'FAC', 'UTM', 'Faculté des Sciences et Technologies', 'sciences@utm.edu', '+33123456701', 'Bâtiment A, Campus Principal'),
          ('École Ingénieurs', 'ECO-ING', 'ECO', 'UTM', 'École d''Ingénieurs et Innovation', 'ingenieurs@utm.edu', '+33123456702', 'Bâtiment B, Campus Principal'),
          ('Institut Management', 'INS-MGT', 'INS', 'UTM', 'Institut de Management et Commerce', 'management@utm.edu', '+33123456703', 'Bâtiment C, Campus Principal'),
          ('Faculté Médecine', 'FAC-MED', 'FAC', 'USA', 'Faculté de Médecine et Santé', 'medecine@usa.edu', '+33123456704', 'Bâtiment D, Campus Santé'),
          ('École Droit', 'ECO-DRT', 'ECO', 'USA', 'École de Droit et Sciences Politiques', 'droit@usa.edu', '+33123456705', 'Bâtiment E, Campus Droit')
      ) AS establishment_data(name, code, type_code, university_code, description, contact_email, contact_phone, address)
      JOIN establishment_types et ON et.code = establishment_data.type_code
      JOIN universities u ON u.code = establishment_data.university_code
      ON CONFLICT (code) DO NOTHING;
    `);

    // 4. Créer des domaines/mentions
    console.log('📚 Inserting domains...');
    await dataSource.query(`
      INSERT INTO domains (id, name, code, establishment_id, description, duration_years)
      SELECT 
        uuid_generate_v4(),
        domain_data.name,
        domain_data.code,
        e.id,
        domain_data.description,
        domain_data.duration_years
      FROM (
        VALUES 
          ('Informatique', 'INFO', 'FAC-SCI', 'Domain de l''informatique et technologies', 3),
          ('Mathématiques', 'MATH', 'FAC-SCI', 'Domain des mathématiques pures et appliquées', 3),
          ('Génie Civil', 'GCIV', 'ECO-ING', 'Domain du génie civil et construction', 5),
          ('Génie Électrique', 'GELEC', 'ECO-ING', 'Domain du génie électrique et énergie', 5),
          ('Management', 'MGT', 'INS-MGT', 'Domain du management et administration', 3),
          ('Marketing', 'MKT', 'INS-MGT', 'Domain du marketing et communication', 3),
          ('Médecine Générale', 'MED-G', 'FAC-MED', 'Domain de la médecine générale', 6),
          ('Chirurgie', 'CHIR', 'FAC-MED', 'Domain de la chirurgie', 6),
          ('Droit Civil', 'DRT-C', 'ECO-DRT', 'Domain du droit civil et privé', 3),
          ('Droit International', 'DRT-I', 'ECO-DRT', 'Domain du droit international', 3)
      ) AS domain_data(name, code, establishment_code, description, duration_years)
      JOIN establishments e ON e.code = domain_data.establishment_code
      ON CONFLICT (code, establishment_id) DO NOTHING;
    `);

    // 5. Créer des parcours/spécialités
    console.log('🎯 Inserting courses...');
    await dataSource.query(`
      INSERT INTO courses (id, name, code, domain_id, description, tuition_fee)
      SELECT 
        uuid_generate_v4(),
        course_data.name,
        course_data.code,
        d.id,
        course_data.description,
        course_data.tuition_fee
      FROM (
        VALUES 
          ('Génie Logiciel', 'GL', 'INFO', 'Parcours en génie logiciel et développement', 4500.00),
          ('IA et Data Science', 'IADS', 'INFO', 'Parcours en intelligence artificielle et science des données', 5000.00),
          ('Maths Fondamentales', 'MATH-F', 'MATH', 'Parcours en mathématiques fondamentales', 4000.00),
          ('Maths Appliquées', 'MATH-A', 'MATH', 'Parcours en mathématiques appliquées', 4200.00),
          ('Bâtiment et TP', 'BTP', 'GCIV', 'Parcours en bâtiment et travaux publics', 5500.00),
          ('Urbanisme', 'URB', 'GCIV', 'Parcours en urbanisme et aménagement', 5200.00),
          ('Énergies Renouvelables', 'ENER', 'GELEC', 'Parcours en énergies renouvelables', 5300.00),
          ('Robotique', 'ROB', 'GELEC', 'Parcours en robotique et automatisme', 5400.00),
          ('Management Stratégique', 'MGT-S', 'MGT', 'Parcours en management stratégique', 3800.00),
          ('Entrepreneuriat', 'ENT', 'MGT', 'Parcours en entrepreneuriat et innovation', 3900.00)
      ) AS course_data(name, code, domain_code, description, tuition_fee)
      JOIN domains d ON d.code = course_data.domain_code
      ON CONFLICT (code, domain_id) DO NOTHING;
    `);

    // 6. Créer des niveaux de parcours
    console.log('📊 Inserting course levels...');
    await dataSource.query(`
      INSERT INTO course_levels (id, course_id, level, academic_year, credits_required)
      SELECT 
        uuid_generate_v4(),
        c.id,
        level_data.level,
        level_data.academic_year,
        level_data.credits_required
      FROM courses c
      CROSS JOIN (
        VALUES 
          ('license', '2024-2025', 60),
          ('master', '2024-2025', 120),
          ('engineering', '2024-2025', 180),
          ('doctorat', '2024-2025', 180)
      ) AS level_data(level, academic_year, credits_required)
      ON CONFLICT (course_id, level, academic_year) DO NOTHING;
    `);

    // 7. Créer des utilisateurs (avec mots de passe hashés)
    console.log('👥 Inserting users...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    const adminHashedPassword = await bcrypt.hash('admin123', 10);

    await dataSource.query(`
      INSERT INTO users (id, email, password, first_name, last_name, phone, role) 
      VALUES 
      -- Super Admin
      (
        uuid_generate_v4(),
        'superadmin@utm.edu',
        $1,
        'Jean',
        'Dupont',
        '+33123456777',
        'super_admin'
      ),
      -- University Admin
      (
        uuid_generate_v4(),
        'admin@utm.edu',
        $1,
        'Marie',
        'Martin',
        '+33123456778',
        'university_admin'
      ),
      -- Establishment Admin
      (
        uuid_generate_v4(),
        'admin.sciences@utm.edu',
        $1,
        'Pierre',
        'Durand',
        '+33123456779',
        'establishment_admin'
      ),
      -- Professors
      (
        uuid_generate_v4(),
        'prof.leclerc@utm.edu',
        $1,
        'Michel',
        'Leclerc',
        '+33123456780',
        'professor'
      ),
      (
        uuid_generate_v4(),
        'prof.bernard@utm.edu',
        $1,
        'Sophie',
        'Bernard',
        '+33123456781',
        'professor'
      ),
      -- Cashier
      (
        uuid_generate_v4(),
        'caisse@utm.edu',
        $1,
        'Nathalie',
        'Petit',
        '+33123456782',
        'cashier'
      )
      ON CONFLICT (email) DO NOTHING;
    `, [adminHashedPassword]);

    // 8. Créer des étudiants
    console.log('🎓 Inserting students...');
    await dataSource.query(`
      INSERT INTO students (id, student_id, user_id, course_id, date_of_birth, gender, nationality, cin, address, city, postal_code, emergency_contact_name, emergency_contact_phone, emergency_contact_relation, enrollment_year, current_year, registration_date, expected_graduation_date, status)
      SELECT 
        uuid_generate_v4(),
        student_data.student_id,
        u.id,
        c.id,
        student_data.date_of_birth,
        student_data.gender,
        student_data.nationality,
        student_data.cin,
        student_data.address,
        student_data.city,
        student_data.postal_code,
        student_data.emergency_contact_name,
        student_data.emergency_contact_phone,
        student_data.emergency_contact_relation,
        student_data.enrollment_year,
        student_data.current_year,
        student_data.registration_date,
        student_data.expected_graduation_date,
        student_data.status
      FROM (
        VALUES 
          ('ETU001', 'etudiant1@utm.edu', 'GL', '2000-05-15', 'male', 'Française', 'AB123456', '123 Rue des Étudiants', 'Paris', '75001', 'Parent Étudiant', '+33123456789', 'Père', '2023-2024', 2, '2023-09-01', '2026-06-30', 'active'),
          ('ETU002', 'etudiant2@utm.edu', 'IADS', '2001-03-20', 'female', 'Française', 'CD789012', '456 Avenue des Sciences', 'Lyon', '69001', 'Parent Étudiant', '+33123456790', 'Mère', '2023-2024', 2, '2023-09-01', '2026-06-30', 'active'),
          ('ETU003', 'etudiant3@utm.edu', 'MATH-F', '1999-11-10', 'male', 'Française', 'EF345678', '789 Boulevard Math', 'Marseille', '13001', 'Parent Étudiant', '+33123456791', 'Père', '2023-2024', 2, '2023-09-01', '2026-06-30', 'active'),
          ('ETU004', 'etudiant4@utm.edu', 'BTP', '2000-07-25', 'male', 'Française', 'GH901234', '321 Rue Construction', 'Toulouse', '31000', 'Parent Étudiant', '+33123456792', 'Père', '2023-2024', 2, '2023-09-01', '2028-06-30', 'active'),
          ('ETU005', 'etudiant5@utm.edu', 'ENER', '2001-01-30', 'female', 'Française', 'IJ567890', '654 Avenue Énergie', 'Bordeaux', '33000', 'Parent Étudiant', '+33123456793', 'Mère', '2023-2024', 2, '2023-09-01', '2028-06-30', 'active')
      ) AS student_data(student_id, email, course_code, date_of_birth, gender, nationality, cin, address, city, postal_code, emergency_contact_name, emergency_contact_phone, emergency_contact_relation, enrollment_year, current_year, registration_date, expected_graduation_date, status)
      JOIN courses c ON c.code = student_data.course_code
      JOIN users u ON u.email = student_data.email
      ON CONFLICT (student_id) DO NOTHING;
    `);

    // 9. Créer des utilisateurs étudiants
    console.log('👨‍🎓 Creating student users...');
    await dataSource.query(`
      INSERT INTO users (id, email, password, first_name, last_name, phone, role) 
      VALUES 
      (
        uuid_generate_v4(),
        'etudiant1@utm.edu',
        $1,
        'Lucas',
        'Moreau',
        '+33123456800',
        'student'
      ),
      (
        uuid_generate_v4(),
        'etudiant2@utm.edu',
        $1,
        'Emma',
        'Laurent',
        '+33123456801',
        'student'
      ),
      (
        uuid_generate_v4(),
        'etudiant3@utm.edu',
        $1,
        'Thomas',
        'Simon',
        '+33123456802',
        'student'
      ),
      (
        uuid_generate_v4(),
        'etudiant4@utm.edu',
        $1,
        'Camille',
        'Michel',
        '+33123456803',
        'student'
      ),
      (
        uuid_generate_v4(),
        'etudiant5@utm.edu',
        $1,
        'Hugo',
        'Bernard',
        '+33123456804',
        'student'
      )
      ON CONFLICT (email) DO NOTHING;
    `, [hashedPassword]);

    // 10. Créer des cartes étudiantes
    console.log('💳 Inserting student cards...');
    await dataSource.query(`
      INSERT INTO student_cards (id, card_number, student_id, issue_date, expiration_date, balance, status, pin_hash)
      SELECT 
        uuid_generate_v4(),
        card_data.card_number,
        s.id,
        card_data.issue_date,
        card_data.expiration_date,
        card_data.balance,
        card_data.status,
        card_data.pin_hash
      FROM (
        VALUES 
          ('CARD01', 'ETU001', '2023-09-01', '2026-08-31', 150.50, 'active', '$2a$10$examplehash1'),
          ('CARD02', 'ETU002', '2023-09-01', '2026-08-31', 75.25, 'active', '$2a$10$examplehash2'),
          ('CARD03', 'ETU003', '2023-09-01', '2026-08-31', 200.00, 'active', '$2a$10$examplehash3'),
          ('CARD04', 'ETU004', '2023-09-01', '2028-08-31', 50.00, 'active', '$2a$10$examplehash4'),
          ('CARD05', 'ETU005', '2023-09-01', '2028-08-31', 300.75, 'active', '$2a$10$examplehash5')
      ) AS card_data(card_number, student_id, issue_date, expiration_date, balance, status, pin_hash)
      JOIN students s ON s.student_id = card_data.student_id
      ON CONFLICT (card_number) DO NOTHING;
    `);

    // 11. Créer des transactions
    console.log('💸 Inserting transactions...');
    await dataSource.query(`
      INSERT INTO transactions (id, card_id, amount, transaction_type, merchant, location, description, previous_balance, new_balance, status, transaction_date)
      SELECT 
        uuid_generate_v4(),
        sc.id,
        t.amount,
        t.transaction_type,
        t.merchant,
        t.location,
        t.description,
        t.previous_balance,
        t.new_balance,
        t.status,
        t.transaction_date
      FROM (
        VALUES 
          ('CARD01', 10.50, 'payment', 'Cafétéria Centrale', 'Bâtiment A', 'Déjeuner', 161.00, 150.50, 'completed', '2024-01-15 12:30:00'),
          ('CARD01', 25.00, 'recharge', 'Guichet Caise', 'Bâtiment Admin', 'Recharge carte', 125.00, 150.00, 'completed', '2024-01-10 09:15:00'),
          ('CARD02', 5.75, 'payment', 'Bibliothèque', 'Bâtiment B', 'Photocopies', 81.00, 75.25, 'completed', '2024-01-14 14:20:00'),
          ('CARD03', 50.00, 'recharge', 'En ligne', 'Portail étudiant', 'Recharge en ligne', 150.00, 200.00, 'completed', '2024-01-12 16:45:00'),
          ('CARD04', 15.25, 'payment', 'Restaurant U', 'Bâtiment C', 'Dîner', 65.25, 50.00, 'completed', '2024-01-13 19:00:00')
      ) AS t(card_number, amount, transaction_type, merchant, location, description, previous_balance, new_balance, status, transaction_date)
      JOIN student_cards sc ON sc.card_number = t.card_number
      ON CONFLICT DO NOTHING;
    `);

    // 12. Créer des services
    console.log('🏪 Inserting services...');
    await dataSource.query(`
      INSERT INTO services (id, name, code, description, establishment_id, cost, is_active)
      SELECT 
        uuid_generate_v4(),
        service_data.name,
        service_data.code,
        service_data.description,
        e.id,
        service_data.cost,
        service_data.is_active
      FROM (
        VALUES 
          ('Cafétéria', 'CAFE', 'Service de restauration', 'FAC-SCI', 0.00, true),
          ('Bibliothèque', 'BIB', 'Service de prêt de livres', 'FAC-SCI', 0.00, true),
          ('Impression', 'IMP', 'Service d''impression', 'FAC-SCI', 0.10, true),
          ('Sport', 'SPORT', 'Accès installations sportives', 'FAC-SCI', 5.00, true),
          ('Parking', 'PARK', 'Stationnement véhicules', 'FAC-SCI', 3.00, true)
      ) AS service_data(name, code, description, establishment_code, cost, is_active)
      JOIN establishments e ON e.code = service_data.establishment_code
      ON CONFLICT (code, establishment_id) DO NOTHING;
    `);

    // 13. Créer des directeurs d'établissement
    console.log('👨‍💼 Inserting establishment directors...');
    await dataSource.query(`
      INSERT INTO establishment_directors (id, establishment_id, user_id, start_date)
      SELECT 
        uuid_generate_v4(),
        e.id,
        u.id,
        '2023-09-01'
      FROM establishments e
      JOIN users u ON u.email = 'admin.sciences@utm.edu'
      WHERE e.code = 'FAC-SCI'
      ON CONFLICT (establishment_id, user_id) DO NOTHING;
    `);

    console.log('✅ Database seeds completed successfully!');
    console.log('📊 Summary of inserted data:');
    console.log('   - 2 Universities');
    console.log('   - 3 Establishment types');
    console.log('   - 5 Establishments');
    console.log('   - 10 Domains');
    console.log('   - 10 Courses');
    console.log('   - 40 Course levels');
    console.log('   - 11 Users (various roles)');
    console.log('   - 5 Students');
    console.log('   - 5 Student cards');
    console.log('   - 5 Transactions');
    console.log('   - 5 Services');
    console.log('   - 1 Establishment director');

  } catch (error) {
    console.error('❌ Error running seeds:', error);
    throw error;
  } finally {
    await dataSource.destroy();
  }
}

// Exécuter les seeds
runSeeds().catch(error => {
  console.error('💥 Failed to run seeds:', error);
  process.exit(1);
});