
import React, { useState, useEffect } from 'react';
import { SectionCode, SectionStatus, UserRole, SupportingTestsData } from '../../types';
import SectionHeader from './SectionHeader';

interface SupportingTestsSectionProps {
  sectionData: { data: SupportingTestsData, status: SectionStatus, revisionReason?: string };
  onUpdate: (sectionCode: SectionCode, data: any, status?: SectionStatus) => void;
  userRole: UserRole;
  onRevert: (sectionCode: SectionCode, reason: string) => Promise<void>;
}

const initialFormData: SupportingTestsData = {
    rontgen: '',
    ecg: '',
    pemeriksaanSpesialisLain: ''
}

const SupportingTestsSection: React.FC<SupportingTestsSectionProps> = ({ sectionData, onUpdate, userRole, onRevert }) => {
  const [formData, setFormData] = useState<SupportingTestsData>(sectionData.data || initialFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof SupportingTestsData, string>>>({});
  const [feedback, setFeedback] = useState<string | null>(null);
  const isLocked = sectionData.status === SectionStatus.Submitted && userRole !== UserRole.Admin;

  useEffect(() => {
    setFormData(sectionData.data || initialFormData);
  }, [sectionData]);

  const handleChange = (field: keyof SupportingTestsData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
        setErrors(prev => ({...prev, [field]: undefined}));
    }
  };

  const validate = (): Partial<Record<keyof SupportingTestsData, string>> => {
      const newErrors: Partial<Record<keyof SupportingTestsData, string>> = {};
      if (!formData.rontgen.trim()) newErrors.rontgen = "Hasil rontgen wajib diisi.";
      if (!formData.ecg.trim()) newErrors.ecg = "Hasil ECG wajib diisi.";
      return newErrors;
  }

  const showFeedback = (message: string) => {
    setFeedback(message);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
        await onUpdate(SectionCode.Penunjang, formData);
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
        await onUpdate(SectionCode.Penunjang, formData, SectionStatus.Submitted);
        showFeedback('✔️ Bagian berhasil diserahkan!');
    } catch (err) {
        showFeedback(`❌ Gagal menyerahkan: ${(err as Error).message}`);
    } finally {
        setIsSaving(false);
    }
  };
  
  const handleRevert = (reason: string) => {
    return onRevert(SectionCode.Penunjang, reason);
  }

  const textAreaClasses = (field: keyof SupportingTestsData) => 
    `mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-tni-au focus:ring-tni-au sm:text-sm disabled:bg-gray-100 ${errors[field] ? 'border-red-500' : 'border-gray-300'}`;

  return (
    <div>
      <SectionHeader 
        title="Pemeriksaan Penunjang (36-38)"
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
      <div className="mt-6 space-y-6">
        <div>
          <label htmlFor="rontgen" className="block text-sm font-medium text-gray-700">36. Rontgen Thorax</label>
          <textarea
            id="rontgen"
            rows={4}
            className={textAreaClasses('rontgen')}
            value={formData.rontgen}
            onChange={(e) => handleChange('rontgen', e.target.value)}
            disabled={isLocked}
            placeholder="Tuliskan interpretasi hasil rontgen..."
          />
          {errors.rontgen && <p className="mt-1 text-sm text-red-600">{errors.rontgen}</p>}
        </div>
        <div>
          <label htmlFor="ecg" className="block text-sm font-medium text-gray-700">37. Elektrokardiogram (ECG)</label>
          <textarea
            id="ecg"
            rows={4}
            className={textAreaClasses('ecg')}
            value={formData.ecg}
            onChange={(e) => handleChange('ecg', e.target.value)}
            disabled={isLocked}
            placeholder="Tuliskan interpretasi hasil ECG..."
          />
          {errors.ecg && <p className="mt-1 text-sm text-red-600">{errors.ecg}</p>}
        </div>
         <div>
          <label htmlFor="pemeriksaanSpesialisLain" className="block text-sm font-medium text-gray-700">38. Pemeriksaan Spesialis Lain</label>
          <textarea
            id="pemeriksaanSpesialisLain"
            rows={4}
            className={textAreaClasses('pemeriksaanSpesialisLain')}
            value={formData.pemeriksaanSpesialisLain}
            onChange={(e) => handleChange('pemeriksaanSpesialisLain', e.target.value)}
            disabled={isLocked}
            placeholder="Tuliskan hasil pemeriksaan spesialis lain jika ada..."
          />
          {errors.pemeriksaanSpesialisLain && <p className="mt-1 text-sm text-red-600">{errors.pemeriksaanSpesialisLain}</p>}
        </div>
      </div>
    </div>
  );
};

export default SupportingTestsSection;
