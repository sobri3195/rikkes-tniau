
import React from 'react';
import { Exam, UserRole, SectionCode, SectionStatus } from '../types';
import { SECTION_CONFIG } from '../constants';
import CheckIcon from './icons/CheckIcon';
import LockIcon from './icons/LockIcon';
import EditIcon from './icons/EditIcon';
import RevertIcon from './icons/RevertIcon';

interface ExamSidebarProps {
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
    revisionReason?: string;
    onClick: () => void;
}> = ({ title, status, isActive, isEditable, isLocked, revisionReason, onClick }) => {
    
    const baseClasses = "group relative w-full text-left px-4 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tni-au border-l-4";

    const needsRevision = status === SectionStatus.Draft && !!revisionReason && isEditable;

    let icon = null;
    let tooltipText = '';

    // Determine icon and tooltip text based on status
    if (needsRevision) {
        icon = <RevertIcon className="h-5 w-5 text-red-600" />;
        tooltipText = "Admin meminta revisi untuk bagian ini.";
    } else if (status === SectionStatus.Submitted) {
        icon = <CheckIcon className="h-5 w-5 text-green-500" />;
        tooltipText = "Bagian ini telah diserahkan dan dikunci.";
    } else if (isEditable) {
        icon = <EditIcon className="h-5 w-5 text-yellow-600" />;
        tooltipText = "Anda dapat mengedit bagian ini.";
    } else {
        icon = <LockIcon className="h-5 w-5 text-gray-400" />;
        tooltipText = "Anda tidak memiliki akses untuk mengedit bagian ini.";
    }

    let stateClasses = '';
    if (isActive) {
        stateClasses = "bg-tni-au-dark text-white shadow-lg border-tni-au-secondary";
    } else if (needsRevision) {
        stateClasses = "bg-red-50 text-red-800 hover:bg-red-100 border-red-500";
    } else if (status === SectionStatus.Submitted) {
        stateClasses = "bg-white text-gray-700 hover:bg-tni-au-light border-green-500";
    } else if (isEditable) { // This means status is Draft and user has rights
        stateClasses = "bg-white text-tni-au-dark hover:bg-tni-au-light border-yellow-500";
    } else { // This means status is Draft and user does NOT have rights (isLocked)
        stateClasses = "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300";
    }

    return (
        <li>
            <button
                onClick={onClick}
                className={`${baseClasses} ${stateClasses}`}
                disabled={isLocked && status !== SectionStatus.Submitted}
                aria-label={`${title} - Status: ${tooltipText}`}
            >
                <span>{title}</span>
                <div className="relative">
                    {icon}
                     <div 
                      role="tooltip"
                      className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max max-w-xs px-2 py-1 bg-gray-900 text-white text-xs font-medium rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 pointer-events-none z-10"
                    >
                        {tooltipText}
                        <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-900"></div>
                    </div>
                </div>
            </button>
        </li>
    );
};

const ExamSidebar: React.FC<ExamSidebarProps> = ({ exam, userRole, activeSection, onSelectSection }) => {

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
                            revisionReason={section.revisionReason}
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

export default ExamSidebar;
