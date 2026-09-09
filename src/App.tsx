import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { AppLayout } from './components/layout/AppLayout';
import { TabId } from './components/layout/Sidebar';
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { ForgotPasswordPage } from './pages/public/ForgotPasswordPage';
import { OnboardingFlow } from './pages/onboarding/OnboardingFlow';

// SchoolFlow TN Pages
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { StudentsList } from './pages/students/StudentsList';
import { StudentDetail } from './pages/students/StudentDetail';
import { StudentModal } from './pages/students/StudentModal';
import { FormationsList } from './pages/formations/FormationsList';
import { FormationDetail } from './pages/formations/FormationDetail';
import { FormationModal } from './pages/formations/FormationModal';
import { GroupsList } from './pages/groups/GroupsList';
import { GroupModal } from './pages/groups/GroupModal';
import { TrainersList } from './pages/trainers/TrainersList';
import { TrainerDetail } from './pages/trainers/TrainerDetail';
import { TrainerModal } from './pages/trainers/TrainerModal';
import { SchedulePage } from './pages/schedule/SchedulePage';
import { AttendancePage } from './pages/attendance/AttendancePage';
import { PaymentsPage } from './pages/payments/PaymentsPage';
import { EvaluationsPage } from './pages/evaluations/EvaluationsPage';
import { DocumentsPage } from './pages/documents/DocumentsPage';
import { SchoolFlowAIPage } from './pages/ai/SchoolFlowAIPage';
import { ReportsPage } from './pages/reports/ReportsPage';
import { SettingsPage } from './pages/settings/SettingsPage';
import { StudentPortal } from './pages/portal/StudentPortal';
import { TrainerPortal } from './pages/portal/TrainerPortal';

import { useData } from './context/DataContext';
import { toast, ToastContainer } from './components/ui/Toast';
import { Student, Formation, Trainer, Group } from './types';

type PublicView = 'landing' | 'login' | 'register' | 'forgot-password';

export default function App() {
  const { user, isAuthenticated, isLoading, login } = useAuth();
  const {
    createStudent,
    updateStudent,
    deleteStudent,
    createFormation,
    updateFormation,
    createGroup,
    updateGroup,
    createTrainer,
    updateTrainer,
  } = useData();

  // Public View State
  const [publicView, setPublicView] = useState<PublicView>('landing');

  // Authenticated State: Active Navigation Tab
  const [currentTab, setCurrentTab] = useState<TabId>('dashboard');

  // Drill-down selection states
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedFormationId, setSelectedFormationId] = useState<string | null>(null);
  const [selectedTrainerId, setSelectedTrainerId] = useState<string | null>(null);

  // Quick Action Modal states
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const [isFormationModalOpen, setIsFormationModalOpen] = useState(false);
  const [editingFormation, setEditingFormation] = useState<Formation | null>(null);

  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [targetFormationIdForGroup, setTargetFormationIdForGroup] = useState<string | undefined>(undefined);

  const [isTrainerModalOpen, setIsTrainerModalOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null);

  // Initial loader
  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl animate-pulse shadow-lg shadow-indigo-600/30">
            SF
          </div>
          <p className="text-xs text-slate-400 font-medium">Chargement de SchoolFlow TN...</p>
        </div>
      </div>
    );
  }

  // 1. PUBLIC ROUTES (Landing, Login, Register, Forgot Password)
  if (!isAuthenticated) {
    return (
      <>
        {publicView === 'login' && (
          <LoginPage
            onGoToRegister={() => setPublicView('register')}
            onGoToForgotPassword={() => setPublicView('forgot-password')}
            onBackToLanding={() => setPublicView('landing')}
          />
        )}
        {publicView === 'register' && (
          <RegisterPage
            onGoToLogin={() => setPublicView('login')}
            onBackToLanding={() => setPublicView('landing')}
            onRegistered={() => {}}
          />
        )}
        {publicView === 'forgot-password' && (
          <ForgotPasswordPage onBackToLogin={() => setPublicView('login')} />
        )}
        {publicView === 'landing' && (
          <LandingPage
            onGoToLogin={() => setPublicView('login')}
            onGoToRegister={() => setPublicView('register')}
            onExploreDemo={async () => {
              await login('direction@techacademy.tn');
              toast.success('Bienvenue dans la démo SchoolFlow TN (Tech Academy Tunisia) !');
            }}
          />
        )}
        <ToastContainer />
      </>
    );
  }

  // 2. ONBOARDING WIZARD
  if (user && !user.isOnboarded) {
    return (
      <>
        <OnboardingFlow onComplete={() => setCurrentTab('dashboard')} />
        <ToastContainer />
      </>
    );
  }

  // 3. SPECIALIZED ROLE VIEWS
  // If user role is student, show dedicated Student Portal
  if (user?.role === 'student') {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <StudentPortal />
        <ToastContainer />
      </div>
    );
  }

  // Handle Quick Action from Header
  const handleQuickAction = (action: 'student' | 'session' | 'payment' | 'group' | 'ai') => {
    if (action === 'student') {
      setEditingStudent(null);
      setIsStudentModalOpen(true);
    } else if (action === 'session') {
      setCurrentTab('schedule');
    } else if (action === 'payment') {
      setCurrentTab('payments');
    } else if (action === 'group') {
      setEditingGroup(null);
      setTargetFormationIdForGroup(undefined);
      setIsGroupModalOpen(true);
    } else if (action === 'ai') {
      setCurrentTab('ai');
    }
  };

  const handleNavigate = (tab: TabId, itemId?: string) => {
    setCurrentTab(tab);
    if (tab === 'students' && itemId) {
      setSelectedStudentId(itemId);
    } else if (tab === 'formations' && itemId) {
      setSelectedFormationId(itemId);
    } else if (tab === 'trainers' && itemId) {
      setSelectedTrainerId(itemId);
    }
  };

  return (
    <AppLayout
      currentTab={currentTab}
      onSelectTab={(tab) => {
        setCurrentTab(tab);
        setSelectedStudentId(null);
        setSelectedFormationId(null);
        setSelectedTrainerId(null);
      }}
      onQuickAction={handleQuickAction}
    >
      {/* Dynamic Tab Content */}

      {/* DASHBOARD */}
      {currentTab === 'dashboard' && (
        <DashboardPage
          onNavigate={handleNavigate}
          onQuickAction={handleQuickAction}
        />
      )}

      {/* STUDENTS */}
      {currentTab === 'students' && (
        selectedStudentId ? (
          <StudentDetail
            studentId={selectedStudentId}
            onBack={() => setSelectedStudentId(null)}
            onEdit={(stu) => {
              setEditingStudent(stu);
              setIsStudentModalOpen(true);
            }}
            onDelete={(id) => {
              deleteStudent(id);
              setSelectedStudentId(null);
            }}
            onRecordPayment={() => setCurrentTab('payments')}
          />
        ) : (
          <StudentsList
            onSelectStudent={(id) => setSelectedStudentId(id)}
            onNewStudent={() => {
              setEditingStudent(null);
              setIsStudentModalOpen(true);
            }}
          />
        )
      )}

      {/* FORMATIONS */}
      {currentTab === 'formations' && (
        selectedFormationId ? (
          <FormationDetail
            formationId={selectedFormationId}
            onBack={() => setSelectedFormationId(null)}
            onEdit={(form) => {
              setEditingFormation(form);
              setIsFormationModalOpen(true);
            }}
            onCreateGroup={(formId) => {
              setTargetFormationIdForGroup(formId);
              setEditingGroup(null);
              setIsGroupModalOpen(true);
            }}
            onSelectStudent={(sId) => {
              setSelectedStudentId(sId);
              setCurrentTab('students');
            }}
          />
        ) : (
          <FormationsList
            onSelectFormation={(id) => setSelectedFormationId(id)}
            onCreateGroupForFormation={(fId) => {
              setTargetFormationIdForGroup(fId);
              setEditingGroup(null);
              setIsGroupModalOpen(true);
            }}
          />
        )
      )}

      {/* GROUPS */}
      {currentTab === 'groups' && (
        <GroupsList
          onNavigate={handleNavigate}
          onPlanSessionForGroup={() => setCurrentTab('schedule')}
        />
      )}

      {/* TRAINERS */}
      {currentTab === 'trainers' && (
        selectedTrainerId ? (
          <TrainerDetail
            trainerId={selectedTrainerId}
            onBack={() => setSelectedTrainerId(null)}
            onEdit={(t) => {
              setEditingTrainer(t);
              setIsTrainerModalOpen(true);
            }}
          />
        ) : (
          <TrainersList
            onSelectTrainer={(id) => setSelectedTrainerId(id)}
          />
        )
      )}

      {/* SCHEDULE */}
      {currentTab === 'schedule' && (
        <SchedulePage onNavigate={handleNavigate} />
      )}

      {/* ATTENDANCE */}
      {currentTab === 'attendance' && (
        <AttendancePage />
      )}

      {/* PAYMENTS */}
      {currentTab === 'payments' && (
        <PaymentsPage />
      )}

      {/* EVALUATIONS */}
      {currentTab === 'evaluations' && (
        <EvaluationsPage />
      )}

      {/* DOCUMENTS & CERTIFICATES */}
      {currentTab === 'documents' && (
        <DocumentsPage />
      )}

      {/* SCHOOLFLOW AI */}
      {currentTab === 'ai' && (
        <SchoolFlowAIPage />
      )}

      {/* REPORTS */}
      {currentTab === 'reports' && (
        <ReportsPage />
      )}

      {/* SETTINGS */}
      {currentTab === 'settings' && (
        <SettingsPage />
      )}

      {/* DIRECT ACCESS PORTALS */}
      {currentTab === 'student-portal' && (
        <StudentPortal />
      )}

      {currentTab === 'trainer-portal' && (
        <TrainerPortal onNavigate={handleNavigate} />
      )}

      {/* GLOBAL MODALS */}

      {/* Student Modal */}
      <StudentModal
        isOpen={isStudentModalOpen}
        onClose={() => {
          setIsStudentModalOpen(false);
          setEditingStudent(null);
        }}
        onSave={(data, targetGroupId) => {
          if (editingStudent) {
            updateStudent({ ...editingStudent, ...data });
            toast.success('Étudiant mis à jour avec succès');
          } else {
            createStudent(data, targetGroupId);
            toast.success('Nouvel étudiant inscrit avec succès');
          }
          setIsStudentModalOpen(false);
          setEditingStudent(null);
        }}
        student={editingStudent}
      />

      {/* Formation Modal */}
      <FormationModal
        isOpen={isFormationModalOpen}
        onClose={() => {
          setIsFormationModalOpen(false);
          setEditingFormation(null);
        }}
        onSave={(data) => {
          if (editingFormation) {
            updateFormation({ ...editingFormation, ...data });
            toast.success('Formation mise à jour');
          } else {
            createFormation(data);
            toast.success('Nouvelle formation créée');
          }
          setIsFormationModalOpen(false);
          setEditingFormation(null);
        }}
        formation={editingFormation}
      />

      {/* Group Modal */}
      <GroupModal
        isOpen={isGroupModalOpen}
        onClose={() => {
          setIsGroupModalOpen(false);
          setEditingGroup(null);
          setTargetFormationIdForGroup(undefined);
        }}
        onSave={(data) => {
          if (editingGroup) {
            updateGroup({ ...editingGroup, ...data });
            toast.success('Promotion mise à jour');
          } else {
            createGroup(data);
            toast.success('Nouvelle promotion créée');
          }
          setIsGroupModalOpen(false);
          setEditingGroup(null);
          setTargetFormationIdForGroup(undefined);
        }}
        group={editingGroup}
        initialFormationId={targetFormationIdForGroup}
      />

      {/* Trainer Modal */}
      <TrainerModal
        isOpen={isTrainerModalOpen}
        onClose={() => {
          setIsTrainerModalOpen(false);
          setEditingTrainer(null);
        }}
        onSave={(data) => {
          if (editingTrainer) {
            updateTrainer({ ...editingTrainer, ...data });
            toast.success('Formateur mis à jour');
          } else {
            createTrainer(data);
            toast.success('Formateur ajouté avec succès');
          }
          setIsTrainerModalOpen(false);
          setEditingTrainer(null);
        }}
        trainer={editingTrainer}
      />

      <ToastContainer />
    </AppLayout>
  );
}
