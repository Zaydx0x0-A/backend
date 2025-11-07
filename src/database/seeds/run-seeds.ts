/* eslint-disable prettier/prettier */
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import dataSource from '../data-source';

async function runSeeds() {
  try {
    await dataSource.initialize();
    console.log('📦 Starting database seeds...');

    // ==================== DONNÉES DE RÉFÉRENCE ====================

    // 1. Insérer les types d'établissements AVEC UUID générés manuellement
    console.log('🏛️  Inserting establishment types...');
    const facTypeId = uuidv4();
    const ecoTypeId = uuidv4();
    const insTypeId = uuidv4();

    await dataSource.query(`
      INSERT INTO establishment_types (id, name, code, description) VALUES
      ('${facTypeId}', 'Facultés', 'FACL', 'Type faculté'),
      ('${ecoTypeId}', 'Écoles', 'ECL', 'Type école'),
      ('${insTypeId}', 'Instituts', 'INST', 'Type institut')
    `);

    // 2. Créer des universités AVEC UUID générés manuellement
    console.log('🎓 Inserting universities...');
    const university1Id = uuidv4();
    const university2Id = uuidv4();

    await dataSource.query(`
      INSERT INTO universities (id, name, code, address, city, country, phone, email, website, academic_year_start, academic_year_end) 
      VALUES 
      (
        '${university1Id}', 
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
        '${university2Id}',
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
    `);

    // 3. Créer des établissements (Facultés, Écoles, Instituts) AVEC UUID générés manuellement
    console.log('🏫 Inserting establishments...');
    const establishmentIds = {
      'FAC-SCI': uuidv4(),
      'ECO-ING': uuidv4(),
      'INS-MGT': uuidv4(),
      'FAC-MED': uuidv4(),
      'ECO-DRT': uuidv4()
    };

    await dataSource.query(`
      INSERT INTO establishments (id, name, code, type_id, university_id, description, contact_email, contact_phone, address)
      VALUES 
      (
        '${establishmentIds['FAC-SCI']}', 
        'Faculté Sciences', 
        'FAC-SCI', 
        '${facTypeId}', 
        '${university1Id}', 
        'Faculté des Sciences et Technologies', 
        'sciences@utm.edu', 
        '+33123456701', 
        'Bâtiment A, Campus Principal'
      ),
      (
        '${establishmentIds['ECO-ING']}', 
        'École Ingénieurs', 
        'ECO-ING', 
        '${ecoTypeId}', 
        '${university1Id}', 
        'École d''Ingénieurs et Innovation', 
        'ingenieurs@utm.edu', 
        '+33123456702', 
        'Bâtiment B, Campus Principal'
      ),
      (
        '${establishmentIds['INS-MGT']}', 
        'Institut Management', 
        'INS-MGT', 
        '${insTypeId}', 
        '${university1Id}', 
        'Institut de Management et Commerce', 
        'management@utm.edu', 
        '+33123456703', 
        'Bâtiment C, Campus Principal'
      ),
      (
        '${establishmentIds['FAC-MED']}', 
        'Faculté Médecine', 
        'FAC-MED', 
        '${facTypeId}', 
        '${university2Id}', 
        'Faculté de Médecine et Santé', 
        'medecine@usa.edu', 
        '+33123456704', 
        'Bâtiment D, Campus Santé'
      ),
      (
        '${establishmentIds['ECO-DRT']}', 
        'École Droit', 
        'ECO-DRT', 
        '${ecoTypeId}', 
        '${university2Id}', 
        'École de Droit et Sciences Politiques', 
        'droit@usa.edu', 
        '+33123456705', 
        'Bâtiment E, Campus Droit'
      )
    `);

    // 4. Créer des domaines/mentions AVEC UUID générés manuellement
    console.log('📚 Inserting domains...');
    const domainIds = {
      'INFO': uuidv4(),
      'MATH': uuidv4(),
      'GCIV': uuidv4(),
      'GELEC': uuidv4(),
      'MGT': uuidv4(),
      'MKT': uuidv4(),
      'MED-G': uuidv4(),
      'CHIR': uuidv4(),
      'DRT-C': uuidv4(),
      'DRT-I': uuidv4()
    };

    await dataSource.query(`
      INSERT INTO domains (id, name, code, establishment_id, description, duration_years)
      VALUES 
      ('${domainIds['INFO']}', 'Informatique', 'INFO', '${establishmentIds['FAC-SCI']}', 'Domain de l''informatique et technologies', 3),
      ('${domainIds['MATH']}', 'Mathématiques', 'MATH', '${establishmentIds['FAC-SCI']}', 'Domain des mathématiques pures et appliquées', 3),
      ('${domainIds['GCIV']}', 'Génie Civil', 'GCIV', '${establishmentIds['ECO-ING']}', 'Domain du génie civil et construction', 5),
      ('${domainIds['GELEC']}', 'Génie Électrique', 'GELEC', '${establishmentIds['ECO-ING']}', 'Domain du génie électrique et énergie', 5),
      ('${domainIds['MGT']}', 'Management', 'MGT', '${establishmentIds['INS-MGT']}', 'Domain du management et administration', 3),
      ('${domainIds['MKT']}', 'Marketing', 'MKT', '${establishmentIds['INS-MGT']}', 'Domain du marketing et communication', 3),
      ('${domainIds['MED-G']}', 'Médecine Générale', 'MED-G', '${establishmentIds['FAC-MED']}', 'Domain de la médecine générale', 6),
      ('${domainIds['CHIR']}', 'Chirurgie', 'CHIR', '${establishmentIds['FAC-MED']}', 'Domain de la chirurgie', 6),
      ('${domainIds['DRT-C']}', 'Droit Civil', 'DRT-C', '${establishmentIds['ECO-DRT']}', 'Domain du droit civil et privé', 3),
      ('${domainIds['DRT-I']}', 'Droit International', 'DRT-I', '${establishmentIds['ECO-DRT']}', 'Domain du droit international', 3)
    `);

    // 5. Créer des parcours/spécialités AVEC UUID générés manuellement
    console.log('🎯 Inserting courses...');
    const courseIds = {
      'GL': uuidv4(),
      'IADS': uuidv4(),
      'MATH-F': uuidv4(),
      'MATH-A': uuidv4(),
      'BTP': uuidv4(),
      'URB': uuidv4(),
      'ENER': uuidv4(),
      'ROB': uuidv4(),
      'MGT-S': uuidv4(),
      'ENT': uuidv4()
    };

    await dataSource.query(`
      INSERT INTO courses (id, name, code, domain_id, description, tuition_fee)
      VALUES 
      ('${courseIds['GL']}', 'Génie Logiciel', 'GL', '${domainIds['INFO']}', 'Parcours en génie logiciel et développement', 4500.00),
      ('${courseIds['IADS']}', 'IA et Data Science', 'IADS', '${domainIds['INFO']}', 'Parcours en intelligence artificielle et science des données', 5000.00),
      ('${courseIds['MATH-F']}', 'Maths Fondamentales', 'MATH-F', '${domainIds['MATH']}', 'Parcours en mathématiques fondamentales', 4000.00),
      ('${courseIds['MATH-A']}', 'Maths Appliquées', 'MATH-A', '${domainIds['MATH']}', 'Parcours en mathématiques appliquées', 4200.00),
      ('${courseIds['BTP']}', 'Bâtiment et TP', 'BTP', '${domainIds['GCIV']}', 'Parcours en bâtiment et travaux publics', 5500.00),
      ('${courseIds['URB']}', 'Urbanisme', 'URB', '${domainIds['GCIV']}', 'Parcours en urbanisme et aménagement', 5200.00),
      ('${courseIds['ENER']}', 'Énergies Renouvelables', 'ENER', '${domainIds['GELEC']}', 'Parcours en énergies renouvelables', 5300.00),
      ('${courseIds['ROB']}', 'Robotique', 'ROB', '${domainIds['GELEC']}', 'Parcours en robotique et automatisme', 5400.00),
      ('${courseIds['MGT-S']}', 'Management Stratégique', 'MGT-S', '${domainIds['MGT']}', 'Parcours en management stratégique', 3800.00),
      ('${courseIds['ENT']}', 'Entrepreneuriat', 'ENT', '${domainIds['MGT']}', 'Parcours en entrepreneuriat et innovation', 3900.00)
    `);

    // 6. Créer des niveaux de parcours
    console.log('📊 Inserting course levels...');
    // Pour chaque cours, créer plusieurs niveaux
    const courseLevels: string[] = [];
    for (const courseId of Object.values(courseIds)) {
      const levels = [
        { level: 'license', credits: 60 },
        { level: 'master', credits: 120 },
        { level: 'engineering', credits: 180 },
        { level: 'doctorat', credits: 180 }
      ];
      
      for (const level of levels) {
        courseLevels.push(`('${uuidv4()}', '${courseId}', '${level.level}', '2024-2025', ${level.credits})`);
      }
    }

    if (courseLevels.length > 0) {
      await dataSource.query(`
        INSERT INTO course_levels (id, course_id, level, academic_year, credits_required)
        VALUES ${courseLevels.join(',')}
      `);
    }

    // 7. Créer des utilisateurs étudiants (DOIT ÊTRE AVANT les étudiants)
    console.log('👨‍🎓 Creating student users first...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    const studentUserIds = {
      'etudiant1@utm.edu': uuidv4(),
      'etudiant2@utm.edu': uuidv4(),
      'etudiant3@utm.edu': uuidv4(),
      'etudiant4@utm.edu': uuidv4(),
      'etudiant5@utm.edu': uuidv4()
    };
    
    await dataSource.query(`
      INSERT INTO users (id, email, password, first_name, last_name, phone, role) 
      VALUES 
      (
        '${studentUserIds['etudiant1@utm.edu']}',
        'etudiant1@utm.edu',
        $1,
        'Lucas',
        'Moreau',
        '+33123456800',
        'student'
      ),
      (
        '${studentUserIds['etudiant2@utm.edu']}',
        'etudiant2@utm.edu',
        $1,
        'Emma',
        'Laurent',
        '+33123456801',
        'student'
      ),
      (
        '${studentUserIds['etudiant3@utm.edu']}',
        'etudiant3@utm.edu',
        $1,
        'Thomas',
        'Simon',
        '+33123456802',
        'student'
      ),
      (
        '${studentUserIds['etudiant4@utm.edu']}',
        'etudiant4@utm.edu',
        $1,
        'Camille',
        'Michel',
        '+33123456803',
        'student'
      ),
      (
        '${studentUserIds['etudiant5@utm.edu']}',
        'etudiant5@utm.edu',
        $1,
        'Hugo',
        'Bernard',
        '+33123456804',
        'student'
      )
    `, [hashedPassword]);

    // 8. Créer des utilisateurs admin et staff
    console.log('👥 Inserting admin and staff users...');
    const adminHashedPassword = await bcrypt.hash('admin123', 10);
    const adminUserIds = {
      'superadmin@utm.edu': uuidv4(),
      'admin@utm.edu': uuidv4(),
      'admin.sciences@utm.edu': uuidv4(),
      'prof.leclerc@utm.edu': uuidv4(),
      'prof.bernard@utm.edu': uuidv4(),
      'caisse@utm.edu': uuidv4()
    };

    await dataSource.query(`
      INSERT INTO users (id, email, password, first_name, last_name, phone, role) 
      VALUES 
      -- Super Admin
      (
        '${adminUserIds['superadmin@utm.edu']}',
        'superadmin@utm.edu',
        $1,
        'Jean',
        'Dupont',
        '+33123456777',
        'super_admin'
      ),
      -- University Admin
      (
        '${adminUserIds['admin@utm.edu']}',
        'admin@utm.edu',
        $1,
        'Marie',
        'Martin',
        '+33123456778',
        'university_admin'
      ),
      -- Establishment Admin
      (
        '${adminUserIds['admin.sciences@utm.edu']}',
        'admin.sciences@utm.edu',
        $1,
        'Pierre',
        'Durand',
        '+33123456779',
        'establishment_admin'
      ),
      -- Professors
      (
        '${adminUserIds['prof.leclerc@utm.edu']}',
        'prof.leclerc@utm.edu',
        $1,
        'Michel',
        'Leclerc',
        '+33123456780',
        'professor'
      ),
      (
        '${adminUserIds['prof.bernard@utm.edu']}',
        'prof.bernard@utm.edu',
        $1,
        'Sophie',
        'Bernard',
        '+33123456781',
        'professor'
      ),
      -- Cashier
      (
        '${adminUserIds['caisse@utm.edu']}',
        'caisse@utm.edu',
        $1,
        'Nathalie',
        'Petit',
        '+33123456782',
        'cashier'
      )
    `, [adminHashedPassword]);

    // 9. Créer des étudiants (APRÈS la création des utilisateurs étudiants)
    console.log('🎓 Inserting students...');
    const studentIds = {
      'ETU001': uuidv4(),
      'ETU002': uuidv4(),
      'ETU003': uuidv4(),
      'ETU004': uuidv4(),
      'ETU005': uuidv4()
    };

    await dataSource.query(`
      INSERT INTO students (id, student_id, user_id, course_id, date_of_birth, gender, nationality, cin, address, city, postal_code, emergency_contact_name, emergency_contact_phone, emergency_contact_relation, enrollment_year, current_year, registration_date, expected_graduation_date, status)
      VALUES 
      (
        '${studentIds['ETU001']}', 'ETU001', '${studentUserIds['etudiant1@utm.edu']}', '${courseIds['GL']}', 
        '2000-05-15', 'male', 'Française', 'AB123456', '123 Rue des Étudiants', 'Paris', '75001', 
        'Parent Étudiant', '+33123456789', 'Père', '2023-2024', 2, '2023-09-01', '2026-06-30', 'active'
      ),
      (
        '${studentIds['ETU002']}', 'ETU002', '${studentUserIds['etudiant2@utm.edu']}', '${courseIds['IADS']}', 
        '2001-03-20', 'female', 'Française', 'CD789012', '456 Avenue des Sciences', 'Lyon', '69001', 
        'Parent Étudiant', '+33123456790', 'Mère', '2023-2024', 2, '2023-09-01', '2026-06-30', 'active'
      ),
      (
        '${studentIds['ETU003']}', 'ETU003', '${studentUserIds['etudiant3@utm.edu']}', '${courseIds['MATH-F']}', 
        '1999-11-10', 'male', 'Française', 'EF345678', '789 Boulevard Math', 'Marseille', '13001', 
        'Parent Étudiant', '+33123456791', 'Père', '2023-2024', 2, '2023-09-01', '2026-06-30', 'active'
      ),
      (
        '${studentIds['ETU004']}', 'ETU004', '${studentUserIds['etudiant4@utm.edu']}', '${courseIds['BTP']}', 
        '2000-07-25', 'male', 'Française', 'GH901234', '321 Rue Construction', 'Toulouse', '31000', 
        'Parent Étudiant', '+33123456792', 'Père', '2023-2024', 2, '2023-09-01', '2028-06-30', 'active'
      ),
      (
        '${studentIds['ETU005']}', 'ETU005', '${studentUserIds['etudiant5@utm.edu']}', '${courseIds['ENER']}', 
        '2001-01-30', 'female', 'Française', 'IJ567890', '654 Avenue Énergie', 'Bordeaux', '33000', 
        'Parent Étudiant', '+33123456793', 'Mère', '2023-2024', 2, '2023-09-01', '2028-06-30', 'active'
      )
    `);

    // 10. Créer des cartes étudiantes
    console.log('💳 Inserting student cards...');
    const cardIds = {
      'CARD01': uuidv4(),
      'CARD02': uuidv4(),
      'CARD03': uuidv4(),
      'CARD04': uuidv4(),
      'CARD05': uuidv4()
    };

    await dataSource.query(`
      INSERT INTO student_cards (id, card_number, student_id, issue_date, expiration_date, balance, status, pin_hash)
      VALUES 
      ('${cardIds['CARD01']}', 'CARD01', '${studentIds['ETU001']}', '2023-09-01', '2026-08-31', 150.50, 'active', '$2a$10$examplehash1'),
      ('${cardIds['CARD02']}', 'CARD02', '${studentIds['ETU002']}', '2023-09-01', '2026-08-31', 75.25, 'active', '$2a$10$examplehash2'),
      ('${cardIds['CARD03']}', 'CARD03', '${studentIds['ETU003']}', '2023-09-01', '2026-08-31', 200.00, 'active', '$2a$10$examplehash3'),
      ('${cardIds['CARD04']}', 'CARD04', '${studentIds['ETU004']}', '2023-09-01', '2028-08-31', 50.00, 'active', '$2a$10$examplehash4'),
      ('${cardIds['CARD05']}', 'CARD05', '${studentIds['ETU005']}', '2023-09-01', '2028-08-31', 300.75, 'active', '$2a$10$examplehash5')
    `);

    // 11. Créer des transactions
    console.log('💸 Inserting transactions...');
    await dataSource.query(`
      INSERT INTO transactions (id, card_id, amount, transaction_type, merchant, location, description, previous_balance, new_balance, status, transaction_date)
      VALUES 
      ('${uuidv4()}', '${cardIds['CARD01']}', 10.50, 'payment', 'Cafétéria Centrale', 'Bâtiment A', 'Déjeuner', 161.00, 150.50, 'completed', '2024-01-15 12:30:00'),
      ('${uuidv4()}', '${cardIds['CARD01']}', 25.00, 'recharge', 'Guichet Caise', 'Bâtiment Admin', 'Recharge carte', 125.00, 150.00, 'completed', '2024-01-10 09:15:00'),
      ('${uuidv4()}', '${cardIds['CARD02']}', 5.75, 'payment', 'Bibliothèque', 'Bâtiment B', 'Photocopies', 81.00, 75.25, 'completed', '2024-01-14 14:20:00'),
      ('${uuidv4()}', '${cardIds['CARD03']}', 50.00, 'recharge', 'En ligne', 'Portail étudiant', 'Recharge en ligne', 150.00, 200.00, 'completed', '2024-01-12 16:45:00'),
      ('${uuidv4()}', '${cardIds['CARD04']}', 15.25, 'payment', 'Restaurant U', 'Bâtiment C', 'Dîner', 65.25, 50.00, 'completed', '2024-01-13 19:00:00')
    `);

    // 12. Créer des services
    console.log('🏪 Inserting services...');
    await dataSource.query(`
      INSERT INTO services (id, name, code, description, establishment_id, cost, is_active)
      VALUES 
      ('${uuidv4()}', 'Cafétéria', 'CAFE', 'Service de restauration', '${establishmentIds['FAC-SCI']}', 0.00, true),
      ('${uuidv4()}', 'Bibliothèque', 'BIB', 'Service de prêt de livres', '${establishmentIds['FAC-SCI']}', 0.00, true),
      ('${uuidv4()}', 'Impression', 'IMP', 'Service d''impression', '${establishmentIds['FAC-SCI']}', 0.10, true),
      ('${uuidv4()}', 'Sport', 'SPORT', 'Accès installations sportives', '${establishmentIds['FAC-SCI']}', 5.00, true),
      ('${uuidv4()}', 'Parking', 'PARK', 'Stationnement véhicules', '${establishmentIds['FAC-SCI']}', 3.00, true)
    `);

    // 13. Créer des directeurs d'établissement
    console.log('👨‍💼 Inserting establishment directors...');
    await dataSource.query(`
      INSERT INTO establishment_directors (id, establishment_id, user_id, start_date)
      VALUES 
      ('${uuidv4()}', '${establishmentIds['FAC-SCI']}', '${adminUserIds['admin.sciences@utm.edu']}', '2023-09-01')
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