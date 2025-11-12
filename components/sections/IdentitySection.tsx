
import React, { useState, useEffect } from 'react';
import { SectionCode, SectionStatus, UserRole, IdentityData } from '../../types';
import SectionHeader from './SectionHeader';

interface IdentitySectionProps {
  sectionData: { data: IdentityData, status: SectionStatus, revisionReason?: string };
  onUpdate: (sectionCode: SectionCode, data: any, status?: SectionStatus) => void;
  userRole: UserRole;
  onRevert: (sectionCode: SectionCode, reason: string) => Promise<void>;
}

const initialFormData: IdentityData = {
    maksudPemeriksaan: '',
    tanggalPemeriksaan: '',
    masaKerjaMiliter: '',
    masaKerjaSipil: '',
    anamnesis: '',
};

const IdentitySection: React.FC<IdentitySectionProps> = ({ sectionData, onUpdate, userRole, onRevert }) => {
  const [formData, setFormData] = useState<IdentityData>(sectionData.data || initialFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof IdentityData, string>>>({});
  const [feedback, setFeedback] = useState<string | null>(null);
  const isLocked = sectionData.status === SectionStatus.Submitted && userRole !== UserRole.Admin;

  useEffect(() => {
    setFormData(sectionData.data || initialFormData);
  }, [sectionData]);
  
  const handleChange = (field: keyof IdentityData, value: string) => {
    setFormData(prev => ({...prev, [field]: value}));
    if (errors[field]) {
        setErrors(prev => ({...prev, [field]: undefined}));
    }
  }

  const validate = (): Partial<Record<keyof IdentityData, string>> => {
    const newErrors: Partial<Record<keyof IdentityData, string>> = {};
    if (!formData.maksudPemeriksaan.trim()) newErrors.maksudPemeriksaan = "Maksud pemeriksaan wajib diisi.";
    if (!formData.tanggalPemeriksaan) newErrors.tanggalPemeriksaan = "Tanggal pemeriksaan wajib diisi.";
    if (!formData.masaKerjaMiliter.trim()) newErrors.masaKerjaMiliter = "Masa kerja militer wajib diisi.";
    if (!formData.anamnesis.trim()) newErrors.anamnesis = "Anamnesis wajib diisi.";
    return newErrors;
  };

  const showFeedback = (message: string) => {
    setFeedback(message);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
        await onUpdate(SectionCode.Identitas, formData);
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
        await onUpdate(SectionCode.Identitas, formData, SectionStatus.Submitted);
        showFeedback('✔️ Bagian berhasil diserahkan!');
    } catch (err) {
        showFeedback(`❌ Gagal menyerahkan: ${(err as Error).message}`);
    } finally {
        setIsSaving(false);
    }
  };
  
  const handleRevert = (reason: string) => {
      return onRevert(SectionCode.Identitas, reason);
  }

  const inputClasses = "mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-tni-au disabled:bg-gray-100";
  
  return (
    <div>
      <SectionHeader 
        title="Identitas & Anamnesis (1-12)"
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
      <div className="mt-8 grid grid-cols-12 gap-x-6 gap-y-4">
          <div className="col-span-12 md:col-span-6">
              <label htmlFor="maksudPemeriksaan" className="block text-sm font-medium text-gray-700">3. Maksud Pemeriksaan</label>
              <input type="text" id="maksudPemeriksaan" value={formData.maksudPemeriksaan || ''} onChange={(e) => handleChange('maksudPemeriksaan', e.target.value)} disabled={isLocked} className={`${inputClasses} ${errors.maksudPemeriksaan ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.maksudPemeriksaan && <p className="mt-1 text-sm text-red-600">{errors.maksudPemeriksaan}</p>}
          </div>
          <div className="col-span-12 md:col-span-6">
              <label htmlFor="tanggalPemeriksaan" className="block text-sm font-medium text-gray-700">6. Tanggal Pemeriksaan</label>
              <input type="date" id="tanggalPemeriksaan" value={formData.tanggalPemeriksaan || ''} onChange={(e) => handleChange('tanggalPemeriksaan', e.target.value)} disabled={isLocked} className={`${inputClasses} ${errors.tanggalPemeriksaan ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.tanggalPemeriksaan && <p className="mt-1 text-sm text-red-600">{errors.tanggalPemeriksaan}</p>}
          </div>
           <div className="col-span-12 md:col-span-6">
              <label htmlFor="masaKerjaMiliter" className="block text-sm font-medium text-gray-700">11. Masa Kerja Militer</label>
              <input type="text" id="masaKerjaMiliter" value={formData.masaKerjaMiliter || ''} onChange={(e) => handleChange('masaKerjaMiliter', e.target.value)} disabled={isLocked} className={`${inputClasses} ${errors.masaKerjaMiliter ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.masaKerjaMiliter && <p className="mt-1 text-sm text-red-600">{errors.masaKerjaMiliter}</p>}
          </div>
           <div className="col-span-12 md:col-span-6">
              <label htmlFor="masaKerjaSipil" className="block text-sm font-medium text-gray-700">11. Masa Kerja Sipil</label>
              <input type="text" id="masaKerjaSipil" value={formData.masaKerjaSipil || ''} onChange={(e) => handleChange('masaKerjaSipil', e.target.value)} disabled={isLocked} className={inputClasses} />
          </div>
      </div>
      <div className="mt-6">
        <label htmlFor="anamnesis" className="block text-sm font-medium text-gray-700">
          12. Anamnesis (Penyakit/Operasi/Kelainan akibat pengaruh lingkungan pekerjaan/Kecelakaan yang pernah/sedang dialami sejak uji kesehatan terakhir)
        </label>
        <textarea
          id="anamnesis"
          rows={8}
          className={`${inputClasses} min-h-[150px] ${errors.anamnesis ? 'border-red-500' : 'border-gray-300'}`}
          value={formData.anamnesis || ''}
          onChange={(e) => handleChange('anamnesis', e.target.value)}
          disabled={isLocked}
          placeholder="Tuliskan hasil anamnesis di sini..."
        />
        {errors.anamnesis && <p className="mt-1 text-sm text-red-600">{errors.anamnesis}</p>}
      </div>
    </div>
  );
};

export default IdentitySection;
