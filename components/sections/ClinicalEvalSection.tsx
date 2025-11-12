
import React, { useState, useEffect } from 'react';
import { SectionCode, SectionStatus, UserRole, ClinicalEvalData } from '../../types';
import SectionHeader from './SectionHeader';
import { CLINICAL_EVAL_FIELDS } from '../../constants';


interface ClinicalEvalSectionProps {
  sectionData: { data: ClinicalEvalData, status: SectionStatus, revisionReason?: string };
  onUpdate: (sectionCode: SectionCode, data: any, status?: SectionStatus) => void;
  userRole: UserRole;
  onRevert: (sectionCode: SectionCode, reason: string) => Promise<void>;
}

const ClinicalEvalSection: React.FC<ClinicalEvalSectionProps> = ({ sectionData, onUpdate, userRole, onRevert }) => {
  const [formData, setFormData] = useState<ClinicalEvalData>(sectionData.data || {});
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<string | null>(null);
  const isLocked = sectionData.status === SectionStatus.Submitted && userRole !== UserRole.Admin;

  useEffect(() => {
    setFormData(sectionData.data || {});
  }, [sectionData]);

  const handleChange = (fieldId: string, value: { normal: boolean; abnormalDesc: string }) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const validate = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    CLINICAL_EVAL_FIELDS.forEach(field => {
        const value = formData[field.id];
        if (value && !value.normal && !value.abnormalDesc.trim()) {
            newErrors[field.id] = "Keterangan abnormal wajib diisi jika status abnormal.";
        }
    });
    return newErrors;
  };
  
  const showFeedback = (message: string) => {
    setFeedback(message);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
        await onUpdate(SectionCode.Klinis, formData);
        showFeedback('✔️ Draft berhasil disimpan!');
    } catch (err) {
        showFeedback(`❌ Gagal menyimpan: ${(err as Error).message}`);
    } finally {
        setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
    }
    setErrors({});
    setIsSaving(true);
    try {
        await onUpdate(SectionCode.Klinis, formData, SectionStatus.Submitted);
        showFeedback('✔️ Bagian berhasil diserahkan!');
    } catch (err) {
        showFeedback(`❌ Gagal menyerahkan: ${(err as Error).message}`);
    } finally {
        setIsSaving(false);
    }
  };

  const handleRevert = (reason: string) => {
    return onRevert(SectionCode.Klinis, reason);
  }

  return (
    <div>
      <SectionHeader 
        title="Evaluasi Klinis (13-34)"
        status={sectionData.status}
        isLocked={isLocked}
        isSaving={isSaving}
        feedbackMessage={feedback}
        onSaveDraft={handleSaveDraft}
        onSubmit={handleSubmit}
        userRole={userRole}
        revisionReason={sectionData.revisionReason}
        onRevert={handleRevert}
      />
      <div className="mt-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 font-semibold text-sm text-gray-600 border-b pb-2">
            <div className="md:col-span-1">Pemeriksaan</div>
            <div className="md:col-span-1">Status</div>
            <div className="md:col-span-1">Keterangan Abnormal</div>
        </div>
        {CLINICAL_EVAL_FIELDS.map(field => {
          const value = formData[field.id] || { normal: true, abnormalDesc: '' };
          const error = errors[field.id];
          return (
            <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2 items-center">
                <label htmlFor={`${field.id}-desc`} className="block text-sm font-medium text-gray-700">
                    {field.label}
                </label>
                <div className="flex items-center space-x-4">
                   <div className="flex items-center">
                        <input id={`${field.id}-normal`} type="radio" checked={value.normal} onChange={() => handleChange(field.id, { ...value, normal: true, abnormalDesc: '' })} disabled={isLocked} className="focus:ring-tni-au h-4 w-4 text-tni-au border-gray-300"/>
                        <label htmlFor={`${field.id}-normal`} className="ml-2 block text-sm text-gray-900">Normal</label>
                   </div>
                    <div className="flex items-center">
                        <input id={`${field.id}-abnormal`} type="radio" checked={!value.normal} onChange={() => handleChange(field.id, { ...value, normal: false })} disabled={isLocked} className="focus:ring-tni-au h-4 w-4 text-tni-au border-gray-300"/>
                        <label htmlFor={`${field.id}-abnormal`} className="ml-2 block text-sm text-gray-900">Abnormal</label>
                   </div>
                </div>
                <div>
                    <input
                      type="text"
                      id={`${field.id}-desc`}
                      className={`block w-full rounded-md shadow-sm sm:text-sm ${error ? 'border-red-500' : 'border-gray-300'}`}
                      value={value.abnormalDesc}
                      onChange={(e) => handleChange(field.id, { ...value, abnormalDesc: e.target.value })}
                      disabled={isLocked || value.normal}
                      placeholder="Isi jika abnormal"
                    />
                    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
                </div>
            </div>
        )})}
      </div>
    </div>
  );
};

export default ClinicalEvalSection;
