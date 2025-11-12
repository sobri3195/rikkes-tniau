import React from 'react';
import { Exam, UserRole, SectionCode, SectionStatus } from '../types';
import { SECTION_CONFIG } from '../constants';
import CheckIcon from './icons/CheckIcon';
import LockIcon from './icons/LockIcon';
import EditIcon from './icons/EditIcon';

interface SidebarProps {
  exam: Exam;
  userRole: UserRole;
  activeSection: SectionCode | 'preview';
  onSelectSection: (section: SectionCode | 'preview') => void;
}

const SidebarItem: React.FC<{
    title: string;
    status: SectionStatus;
    isActive: boolean;
    isEditable: boolean;
    isLocked: boolean;
    onClick: () => void;
}> = ({ title, status, isActive, isEditable, isLocked, onClick }) => {
    
    const baseClasses = "w-full text-left px-4 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tni-au border-l-4";

    let icon = null;
    if (status === SectionStatus.Submitted) {
        icon = <CheckIcon className="h-5 w-5 text-green-500" />;
    } else if (isEditable) {
        icon = <EditIcon className="h-5 w-5 text-yellow-600" />;
    } else {
        icon = <LockIcon className="h-5 w-5 text-gray-400" />;
    }

    let stateClasses = '';
    if (isActive) {
        stateClasses = "bg-tni-au-dark text-white shadow-lg border-tni-au-secondary";
    } else if (status === SectionStatus.Submitted) {
        stateClasses = "bg-white text-gray-700 hover:bg-tni-au-light border-green-500";
    } else if (isEditable) { // This means status is Draft and user has rights
        stateClasses = "bg-white text-tni-au-dark hover:bg-tni-au-light border-tni-au";
    } else { // This means status is Draft and user does NOT have rights (isLocked)
        stateClasses = "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300";
    }

    return (
        <li>
            <button
                onClick={onClick}
                className={`${baseClasses} ${stateClasses}`}
                disabled={isLocked && status !== SectionStatus.Submitted}
            >
                <span>{title}</span>
                {icon}
            </button>
        </li>
    );
};

const Sidebar: React.FC<SidebarProps> = ({ exam, userRole, activeSection, onSelectSection }) => {

    return (
        <div className="bg-white p-4 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold text-tni-au-dark mb-4 px-2">Bagian Formulir</h3>
            <ul className="space-y-2">
                {Object.entries(SECTION_CONFIG).map(([code, config]) => {
                    const sectionCode = code as SectionCode;
                    const section = exam.sections[sectionCode];
                    const isEditable = config.roles.includes(userRole) || userRole === UserRole.Admin;
                    const isLocked = !isEditable;
                    
                    return (
                        <SidebarItem
                            key={sectionCode}
                            title={config.title}
                            status={section.status}
                            isActive={activeSection === sectionCode}
                            isEditable={isEditable}
                            isLocked={isLocked}
                            onClick={() => onSelectSection(sectionCode)}
                        />
                    );
                })}
            </ul>
             <div className="mt-6 border-t pt-4">
                <button
                    onClick={() => onSelectSection('preview')}
                    className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tni-au ${activeSection === 'preview' ? 'bg-tni-au-dark text-white shadow-lg' : 'bg-gray-600 text-white hover:bg-gray-700'}`}
                >
                    <span>Preview & Finalisasi PDF</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;