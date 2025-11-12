
import React, { useState, useEffect } from 'react';
import { SectionCode, SectionStatus, UserRole, LabData } from '../../types';
import SectionHeader from './SectionHeader';

interface LabSectionProps {
  sectionData: { data: LabData, status: SectionStatus, revisionReason?: string };
  onUpdate: (sectionCode: SectionCode, data: any, status?: SectionStatus) => void;
  userRole: UserRole;
  onRevert: (sectionCode: SectionCode, reason: string) => Promise<void>;
}

const initialFormData: LabData = {
    darah: { hb: '', leuco: '', bse: '', dif: '' },
    serologi: { hbsag: '', fdrl: '', hiv: '' },
    urine: { bj: '', warna: '', prot: '', red: '', bil: '', sedimentLeuco: '', sedimentEri: '', sedimentKristal: '', sedimentLain: '' },
    golDarah: '',
    pemeriksaanLabLainnya: ''
};

const LabSection: React.FC<LabSectionProps> = ({ sectionData, onUpdate, userRole, onRevert }) => {
  const [formData, setFormData] = useState<LabData>(sectionData.data || initialFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [feedback, setFeedback] = useState<string | null>(null);
  const isLocked = sectionData.status === SectionStatus.Submitted && userRole !== UserRole.Admin;

  useEffect(() => {
    setFormData(sectionData.data || initialFormData);
  }, [sectionData]);

  const handleChange = (category: keyof LabData, field: string | null, value: string) => {
    setFormData(prev => {
        if (field === null) { // For top-level fields like golDarah
            return {...prev, [category]: value};
        }
        return {
            ...prev,
            [category]: {
                ...(prev[category] as object),
                [field]: value
            }
        };
    });

    if (errors[category]?.[field!] || (field === null && errors[category])) {
        setErrors((prev: any) => {
            const newCatErrors = {...(prev[category] || {})};
            if(field === null) {
                const newErrors = {...prev};
                delete newErrors[category];
                return newErrors;
            } else {
                 delete newCatErrors[field];
                 return {...prev, [category]: newCatErrors };
            }
        });
    }
  };
  
  const validate = (): any => {
      const newErrors: any = { darah: {}, serologi: {}, urine: {} };
      
      Object.keys(initialFormData.darah).forEach(key => {
          if (!formData.darah?.[key as keyof typeof initialFormData.darah]?.trim()) newErrors.darah[key] = "Wajib diisi.";
      });
      Object.keys(initialFormData.serologi).forEach(key => {
          if (!formData.serologi?.[key as keyof typeof initialFormData.serologi]?.trim()) newErrors.serologi[key] = "Wajib diisi.";
      });
      Object.keys(initialFormData.urine).forEach(key => {
          if (!formData.urine?.[key as keyof typeof initialFormData.urine]?.trim()) newErrors.urine[key] = "Wajib diisi.";
      });
      if (!formData.golDarah?.trim()) newErrors.golDarah = "Wajib diisi.";

      // Clean up empty error categories
      if (Object.keys(newErrors.darah).length === 0) delete newErrors.darah;
      if (Object.keys(newErrors.serologi).length === 0) delete newErrors.serologi;
      if (Object.keys(newErrors.urine).length === 0) delete newErrors.urine;

      return newErrors;
  }

  const showFeedback = (message: string) => {
    setFeedback(message);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
        await onUpdate(SectionCode.Lab, formData);
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
        await onUpdate(SectionCode.Lab, formData, SectionStatus.Submitted);
        showFeedback('✔️ Bagian berhasil diserahkan!');
    } catch (err) {
        showFeedback(`❌ Gagal menyerahkan: ${(err as Error).message}`);
    } finally {
        setIsSaving(false);
    }
  };
  
  const handleRevert = (reason: string) => {
    return onRevert(SectionCode.Lab, reason);
  }

  const inputClasses = (error: boolean) => 
    `mt-1 block w-full rounded-md shadow-sm sm:text-sm disabled:bg-gray-100 ${error ? 'border-red-500' : 'border-gray-300'}`;

  const renderInput = (category: keyof LabData, field: string, label: string) => (
      <div>
        <label htmlFor={`${category}-${field}`} className="block text-sm font-medium text-gray-700">{label}</label>
        <input
          type="text"
          id={`${category}-${field}`}
          className={inputClasses(!!errors[category]?.[field])}
          value={(formData[category] as any)?.[field] || ''}
          onChange={(e) => handleChange(category, field, e.target.value)}
          disabled={isLocked}
        />
        {errors[category]?.[field] && <p className="mt-1 text-sm text-red-600">{errors[category][field]}</p>}
      </div>
  );
  
  return (
    <div>
      <SectionHeader 
        title="Laboratorium (55-59)"
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
        {/* Darah & Serologi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 border p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-lg text-tni-au-dark">56. Darah</h4>
                <div className="grid grid-cols-2 gap-4">
                    {renderInput('darah', 'hb', 'Hemoglobin (g/dL)')}
                    {renderInput('darah', 'leuco', 'Leukosit (/μL)')}
                    {renderInput('darah', 'bse', 'B.S.E.')}
                    {renderInput('darah', 'dif', 'Dif')}
                </div>
            </div>
             <div className="space-y-4 border p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-lg text-tni-au-dark">57. Serologi</h4>
                <div className="grid grid-cols-1 gap-4">
                    {renderInput('serologi', 'hbsag', 'HbsAg')}
                    {renderInput('serologi', 'fdrl', 'FDRL')}
                    {renderInput('serologi', 'hiv', 'HIV')}
                </div>
            </div>
        </div>
        
        {/* Urine */}
        <div className="border p-4 rounded-lg shadow-sm">
            <h4 className="font-semibold text-lg text-tni-au-dark mb-4">55. Urine</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                 {renderInput('urine', 'bj', 'BJ')}
                 {renderInput('urine', 'warna', 'Warna')}
                 {renderInput('urine', 'prot', 'Prot')}
                 {renderInput('urine', 'red', 'Red')}
                 {renderInput('urine', 'bil', 'Bil')}
                 {renderInput('urine', 'sedimentLeuco', 'Sed. Leuco')}
                 {renderInput('urine', 'sedimentEri', 'Sed. Eri')}
                 {renderInput('urine', 'sedimentKristal', 'Sed. Kristal')}
                 <div className="col-span-2">{renderInput('urine', 'sedimentLain', 'Sed. Lain-lain')}</div>
            </div>
        </div>

        {/* Gol Darah & Lainnya */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border p-4 rounded-lg shadow-sm">
                 <label htmlFor="golDarah" className="block text-sm font-medium text-gray-700">58. Golongan Darah</label>
                <input
                  type="text"
                  id="golDarah"
                  className={inputClasses(!!errors.golDarah)}
                  value={formData.golDarah || ''}
                  onChange={(e) => handleChange('golDarah', null, e.target.value)}
                  disabled={isLocked}
                />
                {errors.golDarah && <p className="mt-1 text-sm text-red-600">{errors.golDarah}</p>}
            </div>
             <div className="border p-4 rounded-lg shadow-sm">
                 <label htmlFor="pemeriksaanLabLainnya" className="block text-sm font-medium text-gray-700">59. Pemeriksaan Lab Lainnya</label>
                <input
                  type="text"
                  id="pemeriksaanLabLainnya"
                  className={inputClasses(false)} // not validated
                  value={formData.pemeriksaanLabLainnya || ''}
                  onChange={(e) => handleChange('pemeriksaanLabLainnya', null, e.target.value)}
                  disabled={isLocked}
                />
            </div>
        </div>
      </div>
    </div>
  );
};

export default LabSection;
