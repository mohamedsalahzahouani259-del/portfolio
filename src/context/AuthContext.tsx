// ====================================================================
// SCHOOLFLOW TN - AUTHENTICATION & MULTI-ROLE CONTEXT
// Roles: Owner, Admin, Secretary, Trainer, Student
// ====================================================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Organization, UserRole } from '../types';
import { StorageService, initializeStorageIfEmpty } from '../lib/storage';
import { DEMO_USERS, DEMO_ORGANIZATION } from '../lib/demoData';

interface AuthContextType {
  user: User | null;
  organization: Organization | null;
  organizations: Organization[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string, targetRole?: UserRole) => Promise<{ success: boolean; error?: string }>;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password?: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  updateProfile: (updates: Partial<User>) => void;
  updateOrganization: (updates: Partial<Organization>) => void;
  completeOnboarding: (
    centerInfo: {
      name: string;
      directorName?: string;
      taxId?: string;
      phone: string;
      email: string;
      address: string;
      city: string;
      governorate: string;
      website?: string;
    },
    config: {
      academicYear: string;
      currency: 'DT' | 'EUR' | 'USD';
    }
  ) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      initializeStorageIfEmpty();
      return StorageService.getCurrentUser() || DEMO_USERS[0];
    } catch {
      return DEMO_USERS[0];
    }
  });

  const [organizations, setOrganizations] = useState<Organization[]>(() => {
    try {
      const orgs = StorageService.getOrganizations();
      return orgs && orgs.length > 0 ? orgs : [DEMO_ORGANIZATION];
    } catch {
      return [DEMO_ORGANIZATION];
    }
  });

  const [currentOrgId, setCurrentOrgId] = useState<string>(() => {
    try {
      const u = StorageService.getCurrentUser();
      if (u && u.currentOrganizationId) return u.currentOrganizationId;
      const orgs = StorageService.getOrganizations();
      return orgs[0]?.id || DEMO_ORGANIZATION.id;
    } catch {
      return DEMO_ORGANIZATION.id;
    }
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    try {
      initializeStorageIfEmpty();
      const currentUser = StorageService.getCurrentUser() || DEMO_USERS[0];
      const allOrgs = StorageService.getOrganizations();

      setUser(currentUser);
      setOrganizations(allOrgs);

      if (currentUser && currentUser.currentOrganizationId) {
        setCurrentOrgId(currentUser.currentOrganizationId);
      } else if (allOrgs.length > 0) {
        setCurrentOrgId(allOrgs[0].id);
      }
    } catch (e) {
      console.error('Error syncing Auth state:', e);
    }
  }, []);

  const currentOrganization =
    organizations.find((o) => o.id === currentOrgId) ||
    organizations[0] ||
    DEMO_ORGANIZATION;

  const login = async (
    email: string,
    _password?: string,
    targetRole?: UserRole
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    // Check if logging in as one of the preconfigured demo roles
    if (targetRole) {
      const matched = DEMO_USERS.find((u) => u.role === targetRole) || DEMO_USERS[0];
      setUser(matched);
      setCurrentOrgId(matched.currentOrganizationId);
      StorageService.setCurrentUser(matched);
      setIsLoading(false);
      return { success: true };
    }

    const allUsers = StorageService.getAllUsers();
    const existing = allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (existing) {
      setUser(existing);
      setCurrentOrgId(existing.currentOrganizationId);
      StorageService.setCurrentUser(existing);
      setIsLoading(false);
      return { success: true };
    }

    // New generic session as director
    const loggedUser: User = {
      id: `usr_${Date.now()}`,
      email,
      firstName: email.split('@')[0].replace('.', ' '),
      lastName: '',
      role: 'owner',
      currentOrganizationId: currentOrganization?.id || 'org_schoolflow_01',
      isOnboarded: true,
    };

    setUser(loggedUser);
    setCurrentOrgId(loggedUser.currentOrganizationId);
    StorageService.setCurrentUser(loggedUser);
    setIsLoading(false);
    return { success: true };
  };

  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    _password?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    if (!firstName.trim() || !lastName.trim()) {
      setIsLoading(false);
      return { success: false, error: 'Veuillez saisir votre nom et votre prénom.' };
    }

    const newOrgId = `org_${Date.now()}`;
    const newOrg: Organization = {
      id: newOrgId,
      name: `Institut ${lastName}`,
      email,
      phone: '',
      address: '',
      city: 'Tunis',
      governorate: 'Tunis',
      country: 'Tunisie',
      currency: 'DT',
      currentAcademicYear: '2026–2027',
      studentIdPrefix: 'STU-2026-',
      receiptPrefix: 'REC-2026-',
      nextStudentNumber: 1,
      nextReceiptNumber: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newUser: User = {
      id: `usr_${Date.now()}`,
      email,
      firstName,
      lastName,
      role: 'owner',
      currentOrganizationId: newOrgId,
      isOnboarded: false, // will trigger onboarding flow
    };

    StorageService.saveOrganization(newOrg);
    StorageService.setCurrentUser(newUser);

    setOrganizations((prev) => [newOrg, ...prev]);
    setCurrentOrgId(newOrgId);
    setUser(newUser);
    setIsLoading(false);

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    StorageService.setCurrentUser(null);
  };

  const switchRole = (role: UserRole) => {
    const matched = DEMO_USERS.find((u) => u.role === role);
    if (matched) {
      setUser(matched);
      StorageService.setCurrentUser(matched);
    } else if (user) {
      const updated = { ...user, role };
      setUser(updated);
      StorageService.setCurrentUser(updated);
    }
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    StorageService.setCurrentUser(updated);
  };

  const updateOrganization = (updates: Partial<Organization>) => {
    if (!currentOrganization) return;
    const updated = { ...currentOrganization, ...updates, updatedAt: new Date().toISOString() };
    StorageService.saveOrganization(updated);
    setOrganizations((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
  };

  const completeOnboarding = (
    centerInfo: {
      name: string;
      directorName?: string;
      taxId?: string;
      phone: string;
      email: string;
      address: string;
      city: string;
      governorate: string;
      website?: string;
    },
    config: {
      academicYear: string;
      currency: 'DT' | 'EUR' | 'USD';
    }
  ) => {
    if (!currentOrganization || !user) return;

    const updatedOrg: Organization = {
      ...currentOrganization,
      name: centerInfo.name,
      directorName: centerInfo.directorName,
      taxId: centerInfo.taxId,
      phone: centerInfo.phone,
      email: centerInfo.email,
      address: centerInfo.address,
      city: centerInfo.city,
      governorate: centerInfo.governorate,
      website: centerInfo.website,
      currentAcademicYear: config.academicYear,
      currency: config.currency,
      updatedAt: new Date().toISOString(),
    };

    StorageService.saveOrganization(updatedOrg);
    setOrganizations((prev) => prev.map((o) => (o.id === updatedOrg.id ? updatedOrg : o)));

    const updatedUser: User = {
      ...user,
      isOnboarded: true,
    };
    setUser(updatedUser);
    StorageService.setCurrentUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        organization: currentOrganization,
        organizations,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        switchRole,
        updateProfile,
        updateOrganization,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
