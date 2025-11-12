
import React, { useState, useEffect } from 'react';
import { SectionCode, SectionStatus, UserRole, MataTHTData } from '../../types';
import SectionHeader from './SectionHeader';

interface SpecialistSectionProps {
  sectionData: { data: MataTHTData, status: SectionStatus, revisionReason?: string };
  onUpdate: (sectionCode: SectionCode, data: any, status?: SectionStatus) => void;
  userRole: UserRole;
  onRevert: (sectionCode: SectionCode, reason: string) => Promise<void>;
}

const initialFormData: MataTHTData = {
    visusOD: '', visusOS: '', koreksiOD: '', koreksiOS: '',
    membedakanWarna: '', pemeriksaanPerimetris: '',
    tekananIntaoculairOD: '', tekananIntaoculairOS: '',
    suaraBisikanAS: '', suaraBisikanAD: ''
};


const SpecialistSection: React.FC<SpecialistSectionProps> = ({ sectionData, onUpdate, userRole, onRevert }) => {
  const [formData, setFormData] = useState<MataTHTData>(sectionData.data || initialFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof MataTHTData, string>>>({});
  const [feedback, setFeedback] = useState<string | null>(null);
  const isLocked = sectionData.status === SectionStatus.Submitted && userRole !== UserRole.Admin;

  useEffect(() => {
    setFormData(sectionData.data || initialFormData);
  }, [sectionData]);

  const handleChange = (field: keyof MataTHTData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
        setErrors(prev => ({...prev, [field]: undefined}));
    }
  };

  const validate = (): Partial<Record<keyof MataTHTData, string>> => {
      const newErrors: Partial<Record<keyof MataTHTData, string>> = {};
      (Object.keys(initialFormData) as Array<keyof MataTHTData>).forEach(key => {
          if (!formData[key] || !formData[key].trim()) {
              newErrors[key] = "Wajib diisi.";
          }
      });
      return newErrors;
  }

  const showFeedback = (message: string) => {
    setFeedback(message);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
        await onUpdate(SectionCode.MataTHT, formData);
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
        await onUpdate(SectionCode.MataTHT, formData, SectionStatus.Submitted);
        showFeedback('✔️ Bagian berhasil diserahkan!');
    } catch (err) {
        showFeedback(`❌ Gagal menyerahkan: ${(err as Error).message}`);
    } finally {
        setIsSaving(false);
    }
  };
  
  const handleRevert = (reason: string) => {
    return onRevert(SectionCode.MataTHT, reason);
  }

  const inputClasses = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-tni-au focus:ring-tni-au sm:text-sm disabled:bg-gray-100";
  const errorInputClasses = (field: keyof MataTHTData) => `${inputClasses} ${errors[field] ? 'border-red-500' : 'border-gray-300'}`;

  return (
    <div>
      <SectionHeader 
        title="Pemeriksaan Mata & THT (45, 51-54)"
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
        {/* Visus */}
        <div>
            <h4 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Pemeriksaan Mata</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">45. Visus</label>
                    <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-gray-500 w-8">OD:</span>
                        <div className="flex-grow">
                             <input type="text" id="visusOD" placeholder="Visus OD" value={formData.visusOD} onChange={(e) => handleChange('visusOD', e.target.value)} disabled={isLocked} className={errorInputClasses('visusOD')} />
                             {errors.visusOD && <p className="mt-1 text-sm text-red-600">{errors.visusOD}</p>}
                        </div>
                    </div>
                     <div className="flex items-center space-x-2 mt-2">
                        <span className="text-sm text-gray-500 w-8">OS:</span>
                        <div className="flex-grow">
                            <input type="text" id="visusOS" placeholder="Visus OS" value={formData.visusOS} onChange={(e) => handleChange('visusOS', e.target.value)} disabled={isLocked} className={errorInputClasses('visusOS')} />
                            {errors.visusOS && <p className="mt-1 text-sm text-red-600">{errors.visusOS}</p>}
                        </div>
                    </div>
                </div>
                 <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">45. Koreksi Sampai</label>
                    <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-gray-500 w-8">OD:</span>
                        <div className="flex-grow">
                            <input type="text" id="koreksiOD" placeholder="Koreksi OD" value={formData.koreksiOD} onChange={(e) => handleChange('koreksiOD', e.target.value)} disabled={isLocked} className={errorInputClasses('koreksiOD')} />
                            {errors.koreksiOD && <p className="mt-1 text-sm text-red-600">{errors.koreksiOD}</p>}
                        </div>
                    </div>
                     <div className="flex items-center space-x-2 mt-2">
                        <span className="text-sm text-gray-500 w-8">OS:</span>
                        <div className="flex-grow">
                             <input type="text" id="koreksiOS" placeholder="Koreksi OS" value={formData.koreksiOS} onChange={(e) => handleChange('koreksiOS', e.target.value)} disabled={isLocked} className={errorInputClasses('koreksiOS')} />
                             {errors.koreksiOS && <p className="mt-1 text-sm text-red-600">{errors.koreksiOS}</p>}
                        </div>
                    </div>
                </div>
                <div>
                    <label htmlFor="membedakanWarna" className="block text-sm font-medium text-gray-700">51. Membedakan Warna</label>
                    <input type="text" id="membedakanWarna" value={formData.membedakanWarna} onChange={(e) => handleChange('membedakanWarna', e.target.value)} disabled={isLocked} className={errorInputClasses('membedakanWarna')} />
                    {errors.membedakanWarna && <p className="mt-1 text-sm text-red-600">{errors.membedakanWarna}</p>}
                </div>
                <div>
                    <label htmlFor="pemeriksaanPerimetris" className="block text-sm font-medium text-gray-700">52. Pemeriksaan Perimetris</label>
                    <input type="text" id="pemeriksaanPerimetris" value={formData.pemeriksaanPerimetris} onChange={(e) => handleChange('pemeriksaanPerimetris', e.target.value)} disabled={isLocked} className={errorInputClasses('pemeriksaanPerimetris')} />
                    {errors.pemeriksaanPerimetris && <p className="mt-1 text-sm text-red-600">{errors.pemeriksaanPerimetris}</p>}
                </div>
                <div>
                    <label htmlFor="tekananIntaoculairOD" className="block text-sm font-medium text-gray-700">53. Tekanan Intraoculair (IOP) OD</label>
                    <input type="text" id="tekananIntaoculairOD" value={formData.tekananIntaoculairOD || ''} onChange={(e) => handleChange('tekananIntaoculairOD', e.target.value)} disabled={isLocked} className={errorInputClasses('tekananIntaoculairOD')} placeholder="e.g., 14 mmHg"/>
                    {errors.tekananIntaoculairOD && <p className="mt-1 text-sm text-red-600">{errors.tekananIntaoculairOD}</p>}
                </div>
                <div>
                    <label htmlFor="tekananIntaoculairOS" className="block text-sm font-medium text-gray-700">53. Tekanan Intraoculair (IOP) OS</label>
                    <input type="text" id="tekananIntaoculairOS" value={formData.tekananIntaoculairOS || ''} onChange={(e) => handleChange('tekananIntaoculairOS', e.target.value)} disabled={isLocked} className={errorInputClasses('tekananIntaoculairOS')} placeholder="e.g., 14 mmHg"/>
                    {errors.tekananIntaoculairOS && <p className="mt-1 text-sm text-red-600">{errors.tekananIntaoculairOS}</p>}
                </div>
            </div>
        </div>
        
        {/* THT */}
        <div>
            <h4 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Pemeriksaan THT</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                    <label htmlFor="suaraBisikanAD" className="block text-sm font-medium text-gray-700">54. Suara Bisikan AD</label>
                    <input type="text" id="suaraBisikanAD" value={formData.suaraBisikanAD} onChange={(e) => handleChange('suaraBisikanAD', e.target.value)} disabled={isLocked} className={errorInputClasses('suaraBisikanAD')} />
                    {errors.suaraBisikanAD && <p className="mt-1 text-sm text-red-600">{errors.suaraBisikanAD}</p>}
                </div>
                 <div>
                    <label htmlFor="suaraBisikanAS" className="block text-sm font-medium text-gray-700">54. Suara Bisikan AS</label>
                    <input type="text" id="suaraBisikanAS" value={formData.suaraBisikanAS} onChange={(e) => handleChange('suaraBisikanAS', e.target.value)} disabled={isLocked} className={errorInputClasses('suaraBisikanAS')} />
                    {errors.suaraBisikanAS && <p className="mt-1 text-sm text-red-600">{errors.suaraBisikanAS}</p>}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialistSection;
