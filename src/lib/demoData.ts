// ====================================================================
// SCHOOLFLOW TN - REALISTIC TUNISIAN DEMO DATA
// Tech Academy Tunisia (Private Institute / Center of Excellence)
// ====================================================================

import {
  Organization,
  User,
  Classroom,
  Trainer,
  Formation,
  Group,
  Student,
  Enrollment,
  ClassSession,
  AttendanceRecord,
  Payment,
  Evaluation,
  Grade,
  Certificate,
  ActivityLog,
} from '../types';

export const DEMO_ORGANIZATION: Organization = {
  id: 'org_schoolflow_01',
  name: 'Tech Academy Tunisia',
  legalName: 'Tech Academy Tunisia Institut Privé SARL',
  directorName: 'Dr. Karim Ben Youssef',
  taxId: '1598432/A/P/M/000',
  email: 'contact@techacademy.tn',
  phone: '+216 71 860 900',
  address: 'Rue du Lac Victoria, Immeuble Golden Towers, Les Berges du Lac 2',
  city: 'Tunis',
  governorate: 'Tunis',
  country: 'Tunisie',
  currency: 'DT',
  currentAcademicYear: '2026–2027',
  logoUrl: '',
  website: 'https://techacademy.tn',
  bankRib: '08 012 0005678901234 56 (BIAT Agence Lac 2)',
  studentIdPrefix: 'STU-2026-',
  receiptPrefix: 'REC-2026-',
  nextStudentNumber: 5,
  nextReceiptNumber: 5,
  createdAt: '2026-01-01T08:00:00Z',
  updatedAt: '2026-09-08T09:00:00Z',
};

export const DEMO_USERS: User[] = [
  {
    id: 'usr_director',
    email: 'direction@techacademy.tn',
    firstName: 'Karim',
    lastName: 'Ben Youssef',
    role: 'owner',
    phone: '+216 98 200 100',
    currentOrganizationId: 'org_schoolflow_01',
    isOnboarded: true,
  },
  {
    id: 'usr_trainer_01',
    email: 'mohamed.benali@techacademy.tn',
    firstName: 'Mohamed',
    lastName: 'Ben Ali',
    role: 'trainer',
    phone: '+216 98 111 222',
    currentOrganizationId: 'org_schoolflow_01',
    linkedTrainerId: 'trn_01',
    isOnboarded: true,
  },
  {
    id: 'usr_student_01',
    email: 'ahmed.bensalah@gmail.com',
    firstName: 'Ahmed',
    lastName: 'Ben Salah',
    role: 'student',
    phone: '+216 55 123 456',
    currentOrganizationId: 'org_schoolflow_01',
    linkedStudentId: 'stu_01',
    isOnboarded: true,
  },
];

export const DEMO_CLASSROOMS: Classroom[] = [
  {
    id: 'room_01',
    organizationId: 'org_schoolflow_01',
    name: 'Salle B204 (Lab Informatique)',
    capacity: 22,
    hasProjector: true,
    hasComputers: true,
  },
  {
    id: 'room_02',
    organizationId: 'org_schoolflow_01',
    name: 'Salle A101 (Amphi Conférence)',
    capacity: 45,
    hasProjector: true,
    hasComputers: false,
  },
  {
    id: 'room_03',
    organizationId: 'org_schoolflow_01',
    name: 'Salle C305 (Atelier Collaboratif)',
    capacity: 18,
    hasProjector: true,
    hasComputers: true,
  },
];

export const DEMO_TRAINERS: Trainer[] = [
  {
    id: 'trn_01',
    organizationId: 'org_schoolflow_01',
    firstName: 'Mohamed',
    lastName: 'Ben Ali',
    specialty: 'Développement Web Full Stack & Cloud',
    email: 'mohamed.benali@techacademy.tn',
    phone: '+216 98 111 222',
    bio: 'Lead Architect avec 12 ans d’expérience en technologies React, Node.js et microservices.',
    hourlyRate: 50.0,
    status: 'active',
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'trn_02',
    organizationId: 'org_schoolflow_01',
    firstName: 'Ahmed',
    lastName: 'Trabelsi',
    specialty: 'Data Science & Intelligence Artificielle',
    email: 'ahmed.trabelsi@techacademy.tn',
    phone: '+216 97 333 444',
    bio: 'Docteur en informatique appliquée et consultant Data pour banques et fintechs tunisiennes.',
    hourlyRate: 55.0,
    status: 'active',
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'trn_03',
    organizationId: 'org_schoolflow_01',
    firstName: 'Sami',
    lastName: 'Mansour',
    specialty: 'Cybersécurité & Audit Systèmes',
    email: 'sami.mansour@techacademy.tn',
    phone: '+216 99 555 666',
    bio: 'Certifié CEH et CISSP, auditeur de conformité pour organismes financiers.',
    hourlyRate: 60.0,
    status: 'active',
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'trn_04',
    organizationId: 'org_schoolflow_01',
    firstName: 'Yassine',
    lastName: 'Jaziri',
    specialty: 'Marketing Digital & Acquisition B2B',
    email: 'yassine.jaziri@techacademy.tn',
    phone: '+216 96 777 888',
    bio: 'Directeur d’agence digitale, expert Google Ads, Meta Business et stratégie d’inbound.',
    hourlyRate: 40.0,
    status: 'active',
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-10T10:00:00Z',
  },
];

export const DEMO_FORMATIONS: Formation[] = [
  {
    id: 'form_01',
    organizationId: 'org_schoolflow_01',
    name: 'Développement Web Full Stack',
    category: 'Informatique',
    description: 'Programme intensif pour concevoir des applications web complètes et modernes avec HTML/CSS, React, Node.js et PostgreSQL.',
    durationHours: 140,
    price: 1850.0,
    maxStudents: 20,
    status: 'active',
    modules: [
      { id: 'mod_01', title: 'HTML5 & CSS3 Moderne (Tailwind)', durationHours: 25, sortOrder: 1 },
      { id: 'mod_02', title: 'JavaScript Moderne (ES6+) & DOM', durationHours: 35, sortOrder: 2 },
      { id: 'mod_03', title: 'React.js & Architecture Composants', durationHours: 40, sortOrder: 3 },
      { id: 'mod_04', title: 'Node.js, Express & API REST', durationHours: 25, sortOrder: 4 },
      { id: 'mod_05', title: 'Bases de Données & Projet de Fin d’Études', durationHours: 15, sortOrder: 5 },
    ],
    createdAt: '2026-01-15T09:00:00Z',
    updatedAt: '2026-01-15T09:00:00Z',
  },
  {
    id: 'form_02',
    organizationId: 'org_schoolflow_01',
    name: 'Data Science & Machine Learning',
    category: 'Data & IA',
    description: 'Maîtrisez Python, le traitement de grands volumes de données avec Pandas et la modélisation prédictive avec Scikit-Learn.',
    durationHours: 120,
    price: 2100.0,
    maxStudents: 18,
    status: 'active',
    modules: [
      { id: 'mod_06', title: 'Python pour la Data & NumPy', durationHours: 30, sortOrder: 1 },
      { id: 'mod_07', title: 'Analyse Exploratoire & Pandas', durationHours: 35, sortOrder: 2 },
      { id: 'mod_08', title: 'Algorithmes de Machine Learning', durationHours: 40, sortOrder: 3 },
      { id: 'mod_09', title: 'Déploiement d’un Modèle d’IA', durationHours: 15, sortOrder: 4 },
    ],
    createdAt: '2026-01-15T09:00:00Z',
    updatedAt: '2026-01-15T09:00:00Z',
  },
  {
    id: 'form_03',
    organizationId: 'org_schoolflow_01',
    name: 'Cybersécurité & Défense Réseaux',
    category: 'Sécurité Informatique',
    description: 'Apprenez les méthodologies d’audit de sécurité, les tests de pénétration et la sécurisation des architectures cloud.',
    durationHours: 90,
    price: 1650.0,
    maxStudents: 15,
    status: 'active',
    modules: [
      { id: 'mod_10', title: 'Fondamentaux des Réseaux & Protocoles', durationHours: 25, sortOrder: 1 },
      { id: 'mod_11', title: 'Sécurité Systèmes & Hacking Éthique', durationHours: 35, sortOrder: 2 },
      { id: 'mod_12', title: 'Gestion des Incidents & Forensics', durationHours: 30, sortOrder: 3 },
    ],
    createdAt: '2026-01-15T09:00:00Z',
    updatedAt: '2026-01-15T09:00:00Z',
  },
  {
    id: 'form_04',
    organizationId: 'org_schoolflow_01',
    name: 'Marketing Digital & Acquisition',
    category: 'Marketing',
    description: 'Stratégie de visibilité sur les réseaux sociaux, campagnes Meta et Google Ads, référencement naturel SEO et CRM.',
    durationHours: 60,
    price: 850.0,
    maxStudents: 22,
    status: 'active',
    modules: [
      { id: 'mod_13', title: 'Stratégie de Contenu & Réseaux Sociaux', durationHours: 20, sortOrder: 1 },
      { id: 'mod_14', title: 'Campagnes Publicitaires Payantes (Ads)', durationHours: 25, sortOrder: 2 },
      { id: 'mod_15', title: 'SEO & Analyse de Performance Web', durationHours: 15, sortOrder: 3 },
    ],
    createdAt: '2026-01-15T09:00:00Z',
    updatedAt: '2026-01-15T09:00:00Z',
  },
];

export const DEMO_GROUPS: Group[] = [
  {
    id: 'grp_01',
    organizationId: 'org_schoolflow_01',
    code: 'DW-01',
    formationId: 'form_01',
    trainerId: 'trn_01', // Mohamed Ben Ali
    classroomId: 'room_01', // Salle B204
    capacity: 20,
    startDate: '2026-08-01',
    endDate: '2026-11-30',
    scheduleDescription: 'Lundi, Mercredi 09:00 – 12:00',
    daysOfWeek: [1, 3],
    startTime: '09:00',
    endTime: '12:00',
    status: 'active',
    createdAt: '2026-07-20T10:00:00Z',
    updatedAt: '2026-07-20T10:00:00Z',
  },
  {
    id: 'grp_02',
    organizationId: 'org_schoolflow_01',
    code: 'DS-01',
    formationId: 'form_02',
    trainerId: 'trn_02', // Ahmed Trabelsi
    classroomId: 'room_01', // Salle B204 (Afternoon)
    capacity: 18,
    startDate: '2026-08-15',
    endDate: '2026-12-15',
    scheduleDescription: 'Mardi, Jeudi 14:00 – 17:00',
    daysOfWeek: [2, 4],
    startTime: '14:00',
    endTime: '17:00',
    status: 'active',
    createdAt: '2026-07-25T10:00:00Z',
    updatedAt: '2026-07-25T10:00:00Z',
  },
  {
    id: 'grp_03',
    organizationId: 'org_schoolflow_01',
    code: 'SEC-01',
    formationId: 'form_03',
    trainerId: 'trn_03', // Sami Mansour
    classroomId: 'room_03', // Salle C305
    capacity: 15,
    startDate: '2026-09-01',
    endDate: '2026-12-30',
    scheduleDescription: 'Samedi 09:00 – 13:00',
    daysOfWeek: [6],
    startTime: '09:00',
    endTime: '13:00',
    status: 'active',
    createdAt: '2026-08-10T10:00:00Z',
    updatedAt: '2026-08-10T10:00:00Z',
  },
];

export const DEMO_STUDENTS: Student[] = [
  {
    id: 'stu_01',
    organizationId: 'org_schoolflow_01',
    studentNumber: 'STU-2026-0001',
    firstName: 'Ahmed',
    lastName: 'Ben Salah',
    email: 'ahmed.bensalah@gmail.com',
    phone: '+216 55 123 456',
    cin: '09876543',
    birthDate: '2001-05-14',
    address: '12 Rue Habib Bourguiba',
    city: 'Tunis',
    status: 'active',
    notes: 'Étudiant très impliqué, bonne base algorithmique.',
    createdAt: '2026-07-28T11:00:00Z',
    updatedAt: '2026-07-28T11:00:00Z',
  },
  {
    id: 'stu_02',
    organizationId: 'org_schoolflow_01',
    studentNumber: 'STU-2026-0002',
    firstName: 'Sarra',
    lastName: 'Trabelsi',
    email: 'sarra.trabelsi@yahoo.com',
    phone: '+216 52 234 567',
    cin: '11223344',
    birthDate: '2002-09-20',
    address: 'Avenue Hédi Nouira, Ennasr 2',
    city: 'Ariana',
    status: 'active',
    notes: 'En reconversion professionnelle vers le développement front-end.',
    createdAt: '2026-07-29T14:00:00Z',
    updatedAt: '2026-07-29T14:00:00Z',
  },
  {
    id: 'stu_03',
    organizationId: 'org_schoolflow_01',
    studentNumber: 'STU-2026-0003',
    firstName: 'Youssef',
    lastName: 'Mansour',
    email: 'youssef.mansour@gmail.com',
    phone: '+216 50 345 678',
    cin: '08765432',
    birthDate: '1999-12-03',
    address: 'Route de Téniour Km 2',
    city: 'Sfax',
    status: 'active',
    notes: 'Diplômé en mathématiques appliquées, suit le cursus Data Science.',
    createdAt: '2026-08-01T09:30:00Z',
    updatedAt: '2026-08-01T09:30:00Z',
  },
  {
    id: 'stu_04',
    organizationId: 'org_schoolflow_01',
    studentNumber: 'STU-2026-0004',
    firstName: 'Amira',
    lastName: 'Jaziri',
    email: 'amira.jaziri@outlook.com',
    phone: '+216 53 456 789',
    cin: '14523698',
    birthDate: '2000-03-18',
    address: 'Khezama Ouest',
    city: 'Sousse',
    status: 'active',
    notes: 'Intéressée par la sécurité offensive et les audits d’infrastructure.',
    createdAt: '2026-08-05T16:00:00Z',
    updatedAt: '2026-08-05T16:00:00Z',
  },
];

export const DEMO_ENROLLMENTS: Enrollment[] = [
  {
    id: 'enr_01',
    organizationId: 'org_schoolflow_01',
    studentId: 'stu_01', // Ahmed Ben Salah
    groupId: 'grp_01', // DW-01
    enrollmentDate: '2026-07-28',
    totalTuition: 1850.0,
    paidAmount: 1250.0, // Reste 600 DT
    status: 'enrolled',
    installmentsCount: 3,
    createdAt: '2026-07-28T11:30:00Z',
  },
  {
    id: 'enr_02',
    organizationId: 'org_schoolflow_01',
    studentId: 'stu_02', // Sarra Trabelsi
    groupId: 'grp_01', // DW-01
    enrollmentDate: '2026-07-29',
    totalTuition: 1850.0,
    paidAmount: 1850.0, // Integralement payé
    status: 'enrolled',
    installmentsCount: 2,
    createdAt: '2026-07-29T14:30:00Z',
  },
  {
    id: 'enr_03',
    organizationId: 'org_schoolflow_01',
    studentId: 'stu_03', // Youssef Mansour
    groupId: 'grp_02', // DS-01
    enrollmentDate: '2026-08-01',
    totalTuition: 2100.0,
    paidAmount: 700.0, // Acompte tranche 1 payée
    status: 'enrolled',
    installmentsCount: 3,
    createdAt: '2026-08-01T10:00:00Z',
  },
  {
    id: 'enr_04',
    organizationId: 'org_schoolflow_01',
    studentId: 'stu_04', // Amira Jaziri
    groupId: 'grp_03', // SEC-01
    enrollmentDate: '2026-08-05',
    totalTuition: 1650.0,
    paidAmount: 550.0,
    status: 'enrolled',
    installmentsCount: 3,
    createdAt: '2026-08-05T16:30:00Z',
  },
];

export const DEMO_PAYMENTS: Payment[] = [
  {
    id: 'pay_01',
    organizationId: 'org_schoolflow_01',
    enrollmentId: 'enr_01',
    studentId: 'stu_01',
    receiptNumber: 'REC-2026-0001',
    amount: 650.0,
    paymentDate: '2026-07-28',
    method: 'bank_transfer',
    notes: 'Tranche 1 à l’inscription — Virement BIAT',
    createdAt: '2026-07-28T11:45:00Z',
  },
  {
    id: 'pay_02',
    organizationId: 'org_schoolflow_01',
    enrollmentId: 'enr_01',
    studentId: 'stu_01',
    receiptNumber: 'REC-2026-0002',
    amount: 600.0,
    paymentDate: '2026-08-28',
    method: 'cash',
    notes: 'Tranche 2 payée à la caisse du centre',
    createdAt: '2026-08-28T10:15:00Z',
  },
  {
    id: 'pay_03',
    organizationId: 'org_schoolflow_01',
    enrollmentId: 'enr_02',
    studentId: 'stu_02',
    receiptNumber: 'REC-2026-0003',
    amount: 1850.0,
    paymentDate: '2026-07-29',
    method: 'check',
    notes: 'Paiement comptant en 1 seul chèque Attijari Bank',
    createdAt: '2026-07-29T15:00:00Z',
  },
  {
    id: 'pay_04',
    organizationId: 'org_schoolflow_01',
    enrollmentId: 'enr_03',
    studentId: 'stu_03',
    receiptNumber: 'REC-2026-0004',
    amount: 700.0,
    paymentDate: '2026-08-01',
    method: 'bank_transfer',
    notes: 'Acompte Tranche 1 / 3',
    createdAt: '2026-08-01T10:15:00Z',
  },
];

// Today sessions and surrounding schedule
const todayStr = new Date().toISOString().split('T')[0];

export const DEMO_SESSIONS: ClassSession[] = [
  {
    id: 'sess_01',
    organizationId: 'org_schoolflow_01',
    groupId: 'grp_01', // DW-01
    trainerId: 'trn_01',
    classroomId: 'room_01',
    moduleTitle: 'React.js & Architecture Composants',
    sessionDate: todayStr,
    startTime: '09:00',
    endTime: '12:00',
    status: 'in_progress',
    notes: 'Atelier pratique sur les hooks useState et useEffect.',
    createdAt: '2026-08-01T08:00:00Z',
  },
  {
    id: 'sess_02',
    organizationId: 'org_schoolflow_01',
    groupId: 'grp_02', // DS-01
    trainerId: 'trn_02',
    classroomId: 'room_01',
    moduleTitle: 'Analyse Exploratoire avec Pandas',
    sessionDate: todayStr,
    startTime: '14:00',
    endTime: '17:00',
    status: 'scheduled',
    notes: 'Nettoyage de jeux de données réels et data visualization.',
    createdAt: '2026-08-01T08:00:00Z',
  },
  {
    id: 'sess_03',
    organizationId: 'org_schoolflow_01',
    groupId: 'grp_03', // SEC-01
    trainerId: 'trn_03',
    classroomId: 'room_03',
    moduleTitle: 'Hacking Éthique & Scan de Vulnérabilités',
    sessionDate: '2026-09-12',
    startTime: '09:00',
    endTime: '13:00',
    status: 'scheduled',
    notes: 'Utilisation de Nmap, Wireshark et Metasploit en environnement confiné.',
    createdAt: '2026-08-01T08:00:00Z',
  },
];

export const DEMO_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att_01',
    sessionId: 'sess_01',
    studentId: 'stu_01', // Ahmed
    status: 'present',
    recordedAt: '2026-09-08T09:05:00Z',
  },
  {
    id: 'att_02',
    sessionId: 'sess_01',
    studentId: 'stu_02', // Sarra
    status: 'present',
    recordedAt: '2026-09-08T09:05:00Z',
  },
];

export const DEMO_EVALUATIONS: Evaluation[] = [
  {
    id: 'eval_01',
    groupId: 'grp_01',
    title: 'Examen Pratique : Application Todo List React & API',
    moduleName: 'React.js & Architecture Composants',
    evaluationDate: '2026-08-25',
    coefficient: 2.0,
    maxGrade: 20.0,
    createdAt: '2026-08-20T10:00:00Z',
  },
  {
    id: 'eval_02',
    groupId: 'grp_01',
    title: 'Quiz Algorithmique & JavaScript ES6',
    moduleName: 'JavaScript Moderne (ES6+)',
    evaluationDate: '2026-08-10',
    coefficient: 1.0,
    maxGrade: 20.0,
    createdAt: '2026-08-05T10:00:00Z',
  },
];

export const DEMO_GRADES: Grade[] = [
  {
    id: 'grd_01',
    evaluationId: 'eval_01',
    studentId: 'stu_01', // Ahmed Ben Salah
    gradeValue: 17.5,
    appreciation: 'Excellent travail, code propre et composants bien découplés.',
    createdAt: '2026-08-26T14:00:00Z',
  },
  {
    id: 'grd_02',
    evaluationId: 'eval_01',
    studentId: 'stu_02', // Sarra Trabelsi
    gradeValue: 16.0,
    appreciation: 'Très bonne maîtrise de l’état et rendu visuel impeccable.',
    createdAt: '2026-08-26T14:00:00Z',
  },
  {
    id: 'grd_03',
    evaluationId: 'eval_02',
    studentId: 'stu_01',
    gradeValue: 18.0,
    appreciation: 'Parfaite compréhension des concepts asynchrones (async/await).',
    createdAt: '2026-08-11T11:00:00Z',
  },
  {
    id: 'grd_04',
    evaluationId: 'eval_02',
    studentId: 'stu_02',
    gradeValue: 15.5,
    appreciation: 'Bon travail, attention à la gestion des erreurs.',
    createdAt: '2026-08-11T11:00:00Z',
  },
];

export const DEMO_CERTIFICATES: Certificate[] = [
  {
    id: 'cert_01',
    organizationId: 'org_schoolflow_01',
    studentId: 'stu_02', // Sarra Trabelsi
    formationId: 'form_04', // Marketing Digital
    certificateNumber: 'CERT-2026-0001',
    issueDate: '2026-07-15',
    mention: 'Très Bien',
    createdAt: '2026-07-15T16:00:00Z',
  },
];

export const DEMO_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'log_01',
    organizationId: 'org_schoolflow_01',
    userName: 'Karim Ben Youssef',
    action: 'Paiement enregistré',
    details: 'Versement de 600,00 DT enregistré pour Ahmed Ben Salah (REC-2026-0002).',
    createdAt: '2026-08-28T10:15:00Z',
  },
  {
    id: 'log_02',
    organizationId: 'org_schoolflow_01',
    userName: 'Mohamed Ben Ali',
    action: 'Évaluation corrigée',
    details: 'Notes publiées pour l’examen React.js du groupe DW-01.',
    createdAt: '2026-08-26T14:05:00Z',
  },
  {
    id: 'log_03',
    organizationId: 'org_schoolflow_01',
    userName: 'Karim Ben Youssef',
    action: 'Nouvel étudiant inscrit',
    details: 'Amira Jaziri inscrite au groupe SEC-01 (Cybersécurité).',
    createdAt: '2026-08-05T16:30:00Z',
  },
];
