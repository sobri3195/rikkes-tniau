
import React, { useState, useCallback } from 'react';
import { Exam, UserRole, SectionCode, Person, ExamStatus, SectionStatus, ExamSection } from '../types';
import ExamSidebar from './ExamSidebar';
import { SECTION_CONFIG } from '../constants';

// Dynamically import section components
import IdentitySection from './sections/IdentitySection';
import ClinicalEvalSection from './sections/ClinicalEvalSection';
import DentalSection from './sections/DentalSection';
import VitalsSection from './sections/VitalsSection';
import SpecialistSection from './sections/SpecialistSection';
import SupportingTestsSection from './sections/SupportingTestsSection';
import LabSection from './sections/LabSection';
import SummarySection from './sections/SummarySection';
import PdfPreview from './shared/PdfPreview';


interface ExamDetailProps {
  exam: Exam;
  userRole: UserRole;
  onBack: () => void;
  onUpdateExam: (exam: Exam) => Promise<Exam>;
  personLookup: Record<string, Person>;
}

const SECTION_COMPONENTS: Record<SectionCode, React.FC<any>> = {
  [SectionCode.Identitas]: IdentitySection,
  [SectionCode.Klinis]: ClinicalEvalSection,
  [SectionCode.Gigi]: DentalSection,
  [SectionCode.Vital]: VitalsSection,
  [SectionCode.MataTHT]: SpecialistSection,
  [SectionCode.Penunjang]: SupportingTestsSection,
  [SectionCode.Lab]: LabSection,
  [SectionCode.Resume]: SummarySection,
};

const ExamHeader: React.FC<{ person?: Person; onBack: () => void }> = ({ person, onBack }) => (
  <div className="mb-6 bg-white p-4 rounded-lg shadow flex justify-between items-center">
    <div>
      <h2 className="text-2xl font-bold text-tni-au-dark">{person?.name || 'Loading...'}</h2>
      <p className="text-gray-600">NRP: {person?.nrp} | Pangkat: {person?.rank} | Satuan: {person?.unit}</p>
    </div>
    <button onClick={onBack} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded transition-colors">
      &larr; Kembali ke Dashboard
    </button>
  </div>
);


const ExamDetail: React.FC<ExamDetailProps> = ({ exam, userRole, onBack, onUpdateExam, personLookup }) => {
  const [activeSection, setActiveSection] = useState<SectionCode | 'preview'>(Object.keys(SECTION_CONFIG)[0] as SectionCode);
  const person = personLookup[exam.personId];

  const handleUpdateSection = useCallback(async (sectionCode: SectionCode, data: any, status?: SectionStatus) => {
    const currentSection = exam.sections[sectionCode];
    const updatedSectionData = { ...currentSection.data, ...data };

    const updatedSection: ExamSection = {
      ...currentSection,
      data: updatedSectionData,
      status: status || currentSection.status,
      lastUpdated: new Date().toISOString(),
      updatedBy: userRole,
    };
    
    // Clear revision reason on any new update by a specialist
    if (updatedSection.revisionReason) {
      delete updatedSection.revisionReason;
    }
    
    const updatedExam: Exam = {
      ...exam,
      sections: {
        ...exam.sections,
        [sectionCode]: updatedSection,
      },
    };
    try {
        await onUpdateExam(updatedExam);
    } catch (error) {
        // Log is already in the hook, just re-throw for the section component to handle UI.
        throw error;
    }
  }, [exam, onUpdateExam, userRole]);
  
  const handleRevertSection = useCallback(async (sectionCode: SectionCode, reason: string) => {
    const updatedExam: Exam = {
      ...exam,
      status: ExamStatus.RevisionNeeded,
      sections: {
        ...exam.sections,
        [sectionCode]: {
          ...exam.sections[sectionCode],
          status: SectionStatus.Draft,
          revisionReason: reason,
          lastUpdated: new Date().toISOString(),
          updatedBy: userRole, // Log admin as the one reverting
        }
      }
    };
    try {
        await onUpdateExam(updatedExam);
    } catch (error) {
        throw error;
    }
  }, [exam, onUpdateExam, userRole]);

  const handleFinalizeExam = useCallback(async () => {
    const finalizedExam: Exam = {
      ...exam,
      status: ExamStatus.Finalized,
      // Also update all sections to Submitted for consistency
      sections: Object.entries(exam.sections).reduce((acc, [key, section]) => {
          // FIX: Cast section to ExamSection before spreading to resolve error on unknown type.
          acc[key as SectionCode] = { ...(section as ExamSection), status: SectionStatus.Submitted };
          return acc;
      }, {} as Record<SectionCode, ExamSection>)
    };
    try {
        await onUpdateExam(finalizedExam);
    } catch (error) {
        throw error;
    }
  }, [exam, onUpdateExam]);

  const ActiveSectionComponent = activeSection !== 'preview' ? SECTION_COMPONENTS[activeSection] : null;

  return (
    <div>
        <ExamHeader person={person} onBack={onBack} />
        <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/4">
                <ExamSidebar
                    exam={exam}
                    userRole={userRole}
                    activeSection={activeSection}
                    onSelectSection={setActiveSection}
                />
            </div>
            <div className="lg:w-3/4">
                <div className="bg-white p-6 rounded-lg shadow-md min-h-[600px]">
                    {activeSection === 'preview' ? (
                        <PdfPreview exam={exam} person={person} onFinalize={handleFinalizeExam} />
                    ) : (
                        ActiveSectionComponent && (
                            <ActiveSectionComponent
                                sectionData={exam.sections[activeSection]}
                                onUpdate={handleUpdateSection}
                                userRole={userRole}
                                onRevert={handleRevertSection}
                            />
                        )
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default ExamDetail;
