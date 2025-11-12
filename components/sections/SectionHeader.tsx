
import React, { useState } from 'react';
import { SectionStatus, UserRole } from '../../types';
import RevisionModal from '../shared/RevisionModal';
import RevertIcon from '../icons/RevertIcon';
import InformationCircleIcon from '../icons/InformationCircleIcon';


interface SectionHeaderProps {
  title: string;
  status: SectionStatus;
  isLocked: boolean;
  isSaving: boolean;
  feedbackMessage: string | null;
  onSaveDraft: () => void;
  onSubmit: () => void;
  userRole: UserRole;
  revisionReason?: string;
  onRevert: (reason: string) => Promise<void>;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, status, isLocked, isSaving, feedbackMessage, onSaveDraft, onSubmit, userRole, revisionReason, onRevert }) => {
  const statusColor = status === SectionStatus.Submitted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  const [isRevertModalOpen, setIsRevertModalOpen] = useState(false);

  const handleRevertConfirm = async (reason: string) => {
    await onRevert(reason);
  };
  
  return (
    <>
      <RevisionModal
        isOpen={isRevertModalOpen}
        onClose={() => setIsRevertModalOpen(false)}
        onSubmit={handleRevertConfirm}
      />
      <div className="pb-4 border-b border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h3 className="text-xl font-bold text-tni-au-dark">{title}</h3>
            <div className="flex items-center gap-4 mt-1">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
                Status: {status}
              </span>
              {feedbackMessage && (
                <span className={`text-sm font-semibold transition-opacity duration-300 ease-in-out ${feedbackMessage.startsWith('❌') ? 'text-red-700' : 'text-green-700'}`}>
                  {feedbackMessage}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            {userRole === UserRole.Admin && status === SectionStatus.Submitted ? (
              <button
                onClick={() => setIsRevertModalOpen(true)}
                disabled={isSaving}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                <RevertIcon className="h-4 w-4 mr-2" />
                Kembalikan ke Draft
              </button>
            ) : !isLocked ? (
              <>
                <button
                  onClick={onSaveDraft}
                  disabled={isSaving}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tni-au disabled:opacity-50"
                >
                  {isSaving ? 'Menyimpan...' : 'Simpan Draft'}
                </button>
                <button
                  onClick={onSubmit}
                  disabled={isSaving}
                  className="px-4 py-2 text-sm font-medium text-white bg-tni-au border border-transparent rounded-md shadow-sm hover:bg-tni-au-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tni-au disabled:opacity-50"
                >
                  {isSaving ? 'Mengirim...' : 'Submit'}
                </button>
              </>
            ) : null}
          </div>
        </div>
        {revisionReason && (
          <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400">
            <div className="flex">
              <div className="flex-shrink-0">
                <InformationCircleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-bold text-yellow-800">Alasan Revisi dari Admin:</p>
                <p className="mt-1 text-sm text-yellow-700 whitespace-pre-wrap">{revisionReason}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SectionHeader;
