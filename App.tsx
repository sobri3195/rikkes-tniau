
import React, { useState, useCallback } from 'react';
import { UserRole } from './types';
import Login from './components/shared/Login';
import Dashboard from './components/Dashboard';
import ExamDetail from './components/ExamDetail';
import { useMockApi } from './hooks/useMockApi';
import AppSidebar from './components/AppSidebar';
import AnalyticsDashboard from './components/AnalyticsDashboard';

export type AppPage = 'dashboard' | 'analytics';

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<AppPage>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { exams, getExamById, updateExam, loading, personLookup, addExamAndPerson, error: apiError } = useMockApi();

  const handleLogin = useCallback((role: UserRole) => {
    setUserRole(role);
    setSelectedExamId(null); 
    setCurrentPage('dashboard');
  }, []);

  const handleLogout = useCallback(() => {
    setUserRole(null);
    setSelectedExamId(null);
  }, []);

  const handleSelectExam = useCallback((examId: string) => {
    setSelectedExamId(examId);
  }, []);
  
  const handleBackToDashboard = useCallback(() => {
    setSelectedExamId(null);
    setCurrentPage('dashboard');
  }, []);

  const handleNavigate = useCallback((page: AppPage) => {
    setSelectedExamId(null);
    setCurrentPage(page);
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarCollapsed(prev => !prev);
  }, []);


  if (!userRole) {
    return <Login onLogin={handleLogin} />;
  }

  if (apiError) {
    return (
        <div className="flex h-screen items-center justify-center text-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl">
                <h2 className="text-2xl font-bold text-red-700">Terjadi Kesalahan</h2>
                <p className="mt-2 text-gray-700">{apiError}</p>
                <button 
                    onClick={() => window.location.reload()} 
                    className="mt-6 px-5 py-2 bg-tni-au text-white font-semibold rounded-lg hover:bg-tni-au-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tni-au"
                >
                    Muat Ulang Halaman
                </button>
            </div>
        </div>
    );
  }

  const selectedExam = selectedExamId ? getExamById(selectedExamId) : null;

  const renderContent = () => {
    if (selectedExam) {
      return (
        <ExamDetail
          exam={selectedExam}
          userRole={userRole}
          onBack={handleBackToDashboard}
          onUpdateExam={updateExam}
          personLookup={personLookup}
        />
      );
    }
    
    switch (currentPage) {
        case 'analytics':
            return <AnalyticsDashboard exams={exams} personLookup={personLookup} />;
        case 'dashboard':
        default:
            return (
                <Dashboard
                    exams={exams}
                    onSelectExam={handleSelectExam}
                    loading={loading}
                    userRole={userRole}
                    personLookup={personLookup}
                    onAddPersonel={addExamAndPerson}
                />
            );
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans">
      <AppSidebar 
        userRole={userRole} 
        onLogout={handleLogout}
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebar}
      />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
