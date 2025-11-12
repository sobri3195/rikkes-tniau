
import React from 'react';
import DashboardIcon from './icons/DashboardIcon';
import LogoutIcon from './icons/LogoutIcon';
import ChartBarIcon from './icons/ChartBarIcon';
import { UserRole } from '../types';
import { AppPage } from '../App';
import Logo from './icons/Logo';
import ChevronDoubleLeftIcon from './icons/ChevronDoubleLeftIcon';

interface AppSidebarProps {
  userRole: UserRole;
  onLogout: () => void;
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ userRole, onLogout, currentPage, onNavigate, isCollapsed, onToggleCollapse }) => {
  
  const navItemClasses = (page: AppPage) => 
      `w-full flex items-center p-3 rounded-lg font-semibold transition-colors duration-200 group relative ${
        isCollapsed ? 'justify-center' : ''
      } ${
        currentPage === page
        ? 'bg-tni-au text-white shadow-inner'
        : 'text-tni-au-light hover:bg-tni-au hover:text-white'
      }`;
  
  return (
    <aside className={`bg-tni-au-dark text-white flex-shrink-0 flex flex-col shadow-lg transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className={`p-4 flex items-center border-b border-tni-au ${isCollapsed ? 'justify-center' : ''}`}>
        <Logo className="h-12 w-12 text-white flex-shrink-0" />
        {!isCollapsed && (
          <div className="ml-3 text-left overflow-hidden">
            <h1 className="text-lg font-bold leading-tight whitespace-nowrap">Sistem Rikkes</h1>
            <p className="text-xs text-tni-au-light whitespace-nowrap">TNI AU</p>
          </div>
        )}
      </div>
      
      <nav className="flex-1 p-2 mt-4">
        <ul className="space-y-2">
          <li>
            <button onClick={() => onNavigate('dashboard')} className={navItemClasses('dashboard')}>
              <DashboardIcon className="h-6 w-6 flex-shrink-0" />
              {!isCollapsed && <span className="ml-3">Dashboard</span>}
              {isCollapsed && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-gray-800 text-white text-sm rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-20">
                  Dashboard
                </div>
              )}
            </button>
          </li>
          {userRole === UserRole.Admin && (
            <li>
              <button onClick={() => onNavigate('analytics')} className={navItemClasses('analytics')}>
                <ChartBarIcon className="h-6 w-6 flex-shrink-0" />
                {!isCollapsed && <span className="ml-3">Analytics</span>}
                {isCollapsed && (
                  <div className="absolute left-full ml-4 px-2 py-1 bg-gray-800 text-white text-sm rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-20">
                    Analytics
                  </div>
                )}
              </button>
            </li>
          )}
        </ul>
      </nav>
      
      <div className="mt-auto">
        <div className="p-2">
           <button 
             onClick={onToggleCollapse} 
             title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
             className="w-full flex items-center justify-center p-3 rounded-lg text-tni-au-light hover:bg-tni-au hover:text-white transition-colors duration-200"
           >
             <ChevronDoubleLeftIcon className={`h-6 w-6 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>
        <div className={`p-4 border-t border-tni-au ${isCollapsed ? 'text-center' : ''}`}>
          {!isCollapsed && (
            <>
              <p className="text-sm text-tni-au-light">Login sebagai:</p>
              <p className="font-semibold capitalize truncate">{userRole.replace('_', ' ')}</p>
            </>
          )}
          <button 
            onClick={onLogout} 
            className={`w-full mt-4 flex items-center bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md ${isCollapsed ? 'justify-center' : 'justify-start'}`}
            title="Logout"
          >
            <LogoutIcon className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span className="ml-2">Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;