import React, { useState } from 'react';
import { Sidebar, TabId } from './Sidebar';
import { Header } from './Header';
import { GlobalSearchModal } from './GlobalSearchModal';

interface AppLayoutProps {
  currentTab: TabId;
  onSelectTab: (tab: TabId) => void;
  onQuickAction: (action: 'student' | 'session' | 'payment' | 'group' | 'ai') => void;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  currentTab,
  onSelectTab,
  onQuickAction,
  children,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans antialiased text-slate-800">
      {/* 1. Desktop Sidebar */}
      <div className="hidden lg:flex shrink-0">
        <Sidebar currentTab={currentTab} onSelectTab={onSelectTab} />
      </div>

      {/* 2. Mobile Drawer Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-slate-900">
            <Sidebar
              currentTab={currentTab}
              onSelectTab={onSelectTab}
              onCloseMobile={() => setIsMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      {/* 3. Main Content Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenGlobalSearch={() => setIsSearchModalOpen(true)}
          onQuickAction={onQuickAction}
        />

        {/* Dynamic Page Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50/70">
          <div className="max-w-7xl mx-auto space-y-6">{children}</div>
        </main>
      </div>

      {/* 4. Global Search Modal (⌘K) */}
      <GlobalSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onNavigate={(tab) => {
          onSelectTab(tab);
          setIsSearchModalOpen(false);
        }}
      />
    </div>
  );
};
