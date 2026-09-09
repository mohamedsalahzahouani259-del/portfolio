-- ====================================================================
-- SCHOOLFLOW TN - COMPLETE MULTI-TENANT DATABASE SCHEMA
-- For Vocational Institutes, Academies & Private Training Centers in Tunisia
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ORGANIZATIONS (Training Center / Tenant Root)
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255),
    director_name VARCHAR(255),
    tax_id VARCHAR(100), -- Matricule fiscal / Agrément ministériel
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    governorate VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Tunisie',
    currency VARCHAR(10) DEFAULT 'DT',
    current_academic_year VARCHAR(20) DEFAULT '2026–2027',
    logo_url TEXT,
    website VARCHAR(255),
    bank_rib VARCHAR(100),
    student_id_prefix VARCHAR(20) DEFAULT 'STU-2026-',
    receipt_prefix VARCHAR(20) DEFAULT 'REC-2026-',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USER ROLES & ORGANIZATION MEMBERS
CREATE TYPE user_role AS ENUM ('owner', 'admin', 'secretary', 'trainer', 'student');

CREATE TABLE IF NOT EXISTS organization_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    role user_role NOT NULL DEFAULT 'secretary',
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, user_id)
);

-- 3. CLASSROOMS (Salles de cours)
CREATE TABLE IF NOT EXISTS classrooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- e.g. "Salle B204 (Lab Informatique)"
    capacity INT NOT NULL DEFAULT 20,
    has_projector BOOLEAN DEFAULT true,
    has_computers BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TRAINERS (Formateurs)
CREATE TABLE IF NOT EXISTS trainers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    specialty VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    bio TEXT,
    hourly_rate NUMERIC(10, 2) DEFAULT 35.00,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. FORMATIONS (Programmes / Cursus)
CREATE TABLE IF NOT EXISTS formations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'Informatique', 'Data', 'Management', etc.
    description TEXT,
    duration_hours INT NOT NULL DEFAULT 120,
    price NUMERIC(15, 3) NOT NULL DEFAULT 0.000, -- En Dinars Tunisiens
    max_students INT DEFAULT 20,
    status VARCHAR(20) DEFAULT 'active', -- active, inactive, archived
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. FORMATION MODULES (Découpage pédagogique)
CREATE TABLE IF NOT EXISTS formation_modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    formation_id UUID NOT NULL REFERENCES formations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration_hours INT NOT NULL,
    sort_order INT DEFAULT 0
);

-- 7. GROUPS (Groupes / Cohortes)
CREATE TABLE IF NOT EXISTS groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL, -- e.g. "DW-01"
    formation_id UUID NOT NULL REFERENCES formations(id) ON DELETE RESTRICT,
    trainer_id UUID REFERENCES trainers(id) ON DELETE SET NULL,
    classroom_id UUID REFERENCES classrooms(id) ON DELETE SET NULL,
    capacity INT NOT NULL DEFAULT 20,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    schedule_description VARCHAR(255), -- "Lundi, Mercredi 09:00 - 12:00"
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. STUDENTS (Étudiants)
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    student_number VARCHAR(100) NOT NULL, -- Unique sequential e.g. STU-2026-0001
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    cin VARCHAR(50), -- Carte d'identité nationale tunisienne
    birth_date DATE,
    address TEXT,
    city VARCHAR(100) DEFAULT 'Tunis',
    status VARCHAR(20) DEFAULT 'active', -- active, inactive, graduated, suspended
    photo_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, student_number)
);

-- 9. ENROLLMENTS (Inscriptions dans un groupe)
CREATE TABLE IF NOT EXISTS enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    enrollment_date DATE DEFAULT CURRENT_DATE,
    total_tuition NUMERIC(15, 3) NOT NULL,
    paid_amount NUMERIC(15, 3) NOT NULL DEFAULT 0.000,
    status VARCHAR(20) DEFAULT 'enrolled',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, group_id)
);

-- 10. CLASS SESSIONS (Séances de cours de l'Emploi du Temps)
CREATE TABLE IF NOT EXISTS class_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    trainer_id UUID NOT NULL REFERENCES trainers(id) ON DELETE RESTRICT,
    classroom_id UUID NOT NULL REFERENCES classrooms(id) ON DELETE RESTRICT,
    module_id UUID REFERENCES formation_modules(id) ON DELETE SET NULL,
    session_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'scheduled', -- scheduled, in_progress, completed, cancelled
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. ATTENDANCE (Feuilles d'émargement / Présences)
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late', 'excused');

CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES class_sessions(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    status attendance_status NOT NULL DEFAULT 'present',
    late_minutes INT DEFAULT 0,
    justification TEXT,
    recorded_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(session_id, student_id)
);

-- 12. PAYMENTS & INSTALLMENTS (Paiements, échéanciers & reçus)
CREATE TYPE payment_method AS ENUM ('cash', 'bank_transfer', 'check', 'card', 'other');

CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
    receipt_number VARCHAR(100) NOT NULL, -- e.g. REC-2026-0001
    amount NUMERIC(15, 3) NOT NULL,
    payment_date DATE NOT NULL,
    method payment_method NOT NULL DEFAULT 'bank_transfer',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. EVALUATIONS & GRADES (Contrôles, examens & notes)
CREATE TABLE IF NOT EXISTS evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    module_name VARCHAR(255) NOT NULL,
    evaluation_date DATE NOT NULL,
    coefficient NUMERIC(4, 2) DEFAULT 1.00,
    max_grade NUMERIC(5, 2) DEFAULT 20.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS grades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    evaluation_id UUID NOT NULL REFERENCES evaluations(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    grade_value NUMERIC(5, 2) NOT NULL,
    appreciation TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(evaluation_id, student_id)
);

-- 14. CERTIFICATES & DOCUMENTS
CREATE TABLE IF NOT EXISTS certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    formation_id UUID NOT NULL REFERENCES formations(id) ON DELETE CASCADE,
    certificate_number VARCHAR(100) NOT NULL, -- CERT-2026-0001
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    mention VARCHAR(50) DEFAULT 'Bien', -- Passable, Assez Bien, Bien, Très Bien, Excellent
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, certificate_number)
);

-- 15. ACTIVITY LOGS (Journal d'activité)
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_name VARCHAR(100) NOT NULL,
    action VARCHAR(255) NOT NULL,
    details TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_sessions_org ON class_sessions(organization_id);
CREATE INDEX IF NOT EXISTS idx_sessions_trainer ON class_sessions(trainer_id, session_date);
CREATE INDEX IF NOT EXISTS idx_sessions_room ON class_sessions(classroom_id, session_date);
CREATE INDEX IF NOT EXISTS idx_students_org ON students(organization_id);
CREATE INDEX IF NOT EXISTS idx_payments_org ON payments(organization_id);
