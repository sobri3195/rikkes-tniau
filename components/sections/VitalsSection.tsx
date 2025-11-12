
import React, { useState, useEffect, useMemo } from 'react';
import { SectionCode, SectionStatus, UserRole, VitalsData } from '../../types';
import SectionHeader from './SectionHeader';

interface VitalsSectionProps {
  sectionData: { data: VitalsData, status: SectionStatus, revisionReason?: string };
  onUpdate: (sectionCode: SectionCode, data: any, status?: SectionStatus) => void;
  userRole: UserRole;
  onRevert: (sectionCode: SectionCode, reason: string) => Promise<void>;
}

const initialFormData: VitalsData = {
    beratBadan: '', tinggiBadan: '', bentukBadan: '',
    tensi: '', nadi: '', temp: '',
    lingkarDadaExp: '', lingkarDadaInsp: '', lingkarPerut: '',
    warnaRambut: '', warnaMata: '', tandaIdentifikasiLain: ''
};

const VitalsSection: React.FC<VitalsSectionProps> = ({ sectionData, onUpdate, userRole, onRevert }) => {
  const [formData, setFormData] = useState<VitalsData>(sectionData.data || initialFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof VitalsData, string>>>({});
  const [feedback, setFeedback] = useState<string | null>(null);
  const isLocked = sectionData.status === SectionStatus.Submitted && userRole !== UserRole.Admin;

  useEffect(() => {
    setFormData(sectionData.data || initialFormData);
  }, [sectionData]);

  const handleChange = (field: keyof VitalsData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: String(value) }));
    if (errors[field]) {
        setErrors(prev => ({...prev, [field]: undefined}));
    }
  };

  const validate = (): Partial<Record<keyof VitalsData, string>> => {
    const newErrors: Partial<Record<keyof VitalsData, string>> = {};
    const requiredNumericFields: (keyof VitalsData)[] = ['tinggiBadan', 'beratBadan', 'nadi', 'temp', 'lingkarDadaExp', 'lingkarDadaInsp', 'lingkarPerut'];
    requiredNumericFields.forEach(field => {
        if (!formData[field]) {
            newErrors[field] = "Wajib diisi.";
        } else if (isNaN(Number(formData[field])) || Number(formData[field]) <= 0) {
            newErrors[field] = "Harus berupa angka positif.";
        }
    });
    
    const requiredTextFields: (keyof VitalsData)[] = ['bentukBadan', 'warnaRambut', 'warnaMata'];
    requiredTextFields.forEach(field => {
        if (!formData[field].trim()) newErrors[field] = "Wajib diisi.";
    });

    if (!formData.tensi.trim()) {
        newErrors.tensi = "Wajib diisi.";
    } else if (!/^\d{2,3}\/\d{2,3}$/.test(formData.tensi)) {
        newErrors.tensi = "Format harus NN/NN, contoh: 120/80.";
    }
    return newErrors;
  };

  const showFeedback = (message: string) => {
    setFeedback(message);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
        await onUpdate(SectionCode.Vital, formData);
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
        await onUpdate(SectionCode.Vital, formData, SectionStatus.Submitted);
        showFeedback('✔️ Bagian berhasil diserahkan!');
    } catch (err) {
        showFeedback(`❌ Gagal menyerahkan: ${(err as Error).message}`);
    } finally {
        setIsSaving(false);
    }
  };

  const handleRevert = (reason: string) => {
    return onRevert(SectionCode.Vital, reason);
  }

  const bmi = useMemo(() => {
    const tinggiM = Number(formData.tinggiBadan) / 100;
    const beratKg = Number(formData.beratBadan);
    if (tinggiM > 0 && beratKg > 0) {
      const bmiValue = beratKg / (tinggiM * tinggiM);
      return bmiValue.toFixed(2);
    }
    return 'N/A';
  }, [formData.tinggiBadan, formData.beratBadan]);

  const inputClasses = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-tni-au focus:ring-tni-au sm:text-sm disabled:bg-gray-100";
  const errorInputClasses = (field: keyof VitalsData) => `${inputClasses} ${errors[field] ? 'border-red-500' : 'border-gray-300'}`;


  return (
    <div>
      <SectionHeader 
        title="Ukuran & Pemeriksaan Lain (39-53)"
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
      <div className="mt-6 grid grid-cols-12 gap-x-6 gap-y-4">
        {/* Antropometri */}
        <div className="col-span-12 md:col-span-3">
          <label htmlFor="beratBadan" className="block text-sm font-medium text-gray-700">39. Berat Badan (kg)</label>
          <input type="number" id="beratBadan" value={formData.beratBadan || ''} onChange={(e) => handleChange('beratBadan', e.target.value)} disabled={isLocked} className={errorInputClasses('beratBadan')} />
          {errors.beratBadan && <p className="mt-1 text-sm text-red-600">{errors.beratBadan}</p>}
        </div>
        <div className="col-span-12 md:col-span-3">
          <label htmlFor="tinggiBadan" className="block text-sm font-medium text-gray-700">40. Tinggi Badan (cm)</label>
          <input type="number" id="tinggiBadan" value={formData.tinggiBadan || ''} onChange={(e) => handleChange('tinggiBadan', e.target.value)} disabled={isLocked} className={errorInputClasses('tinggiBadan')} />
          {errors.tinggiBadan && <p className="mt-1 text-sm text-red-600">{errors.tinggiBadan}</p>}
        </div>
        <div className="col-span-12 md:col-span-3">
          <label htmlFor="bentukBadan" className="block text-sm font-medium text-gray-700">41. Bentuk Badan</label>
          <input type="text" id="bentukBadan" value={formData.bentukBadan || ''} onChange={(e) => handleChange('bentukBadan', e.target.value)} disabled={isLocked} className={errorInputClasses('bentukBadan')} />
          {errors.bentukBadan && <p className="mt-1 text-sm text-red-600">{errors.bentukBadan}</p>}
        </div>
         <div className="col-span-12 md:col-span-3">
          <label className="block text-sm font-medium text-gray-700">Indeks Massa Tubuh (IMT)</label>
          <div className="mt-1 p-2 bg-gray-100 rounded-md h-[42px] flex items-center">{bmi}</div>
        </div>

        {/* Tanda Vital */}
        <div className="col-span-12 md:col-span-3">
          <label htmlFor="tensi" className="block text-sm font-medium text-gray-700">42. Tensi (mmHg)</label>
          <input type="text" id="tensi" value={formData.tensi || ''} onChange={(e) => handleChange('tensi', e.target.value)} disabled={isLocked} className={errorInputClasses('tensi')} placeholder="e.g., 120/80" />
          {errors.tensi && <p className="mt-1 text-sm text-red-600">{errors.tensi}</p>}
        </div>
        <div className="col-span-12 md:col-span-3">
          <label htmlFor="nadi" className="block text-sm font-medium text-gray-700">43. Nadi (x/menit)</label>
          <input type="number" id="nadi" value={formData.nadi || ''} onChange={(e) => handleChange('nadi', e.target.value)} disabled={isLocked} className={errorInputClasses('nadi')} />
          {errors.nadi && <p className="mt-1 text-sm text-red-600">{errors.nadi}</p>}
        </div>
        <div className="col-span-12 md:col-span-3">
          <label htmlFor="temp" className="block text-sm font-medium text-gray-700">44. Temperatur (°C)</label>
          <input type="number" step="0.1" id="temp" value={formData.temp || ''} onChange={(e) => handleChange('temp', e.target.value)} disabled={isLocked} className={errorInputClasses('temp')} />
          {errors.temp && <p className="mt-1 text-sm text-red-600">{errors.temp}</p>}
        </div>

        {/* Lingkar */}
        <div className="col-span-12 md:col-span-6 grid grid-cols-2 gap-4">
            <div>
                 <label htmlFor="lingkarDadaExp" className="block text-sm font-medium text-gray-700">46. Lingkar Dada Exp (cm)</label>
                 <input type="number" id="lingkarDadaExp" value={formData.lingkarDadaExp || ''} onChange={(e) => handleChange('lingkarDadaExp', e.target.value)} disabled={isLocked} className={errorInputClasses('lingkarDadaExp')} />
                 {errors.lingkarDadaExp && <p className="mt-1 text-sm text-red-600">{errors.lingkarDadaExp}</p>}
            </div>
             <div>
                 <label htmlFor="lingkarDadaInsp" className="block text-sm font-medium text-gray-700">Inspirasi (cm)</label>
                 <input type="number" id="lingkarDadaInsp" value={formData.lingkarDadaInsp || ''} onChange={(e) => handleChange('lingkarDadaInsp', e.target.value)} disabled={isLocked} className={errorInputClasses('lingkarDadaInsp')} />
                 {errors.lingkarDadaInsp && <p className="mt-1 text-sm text-red-600">{errors.lingkarDadaInsp}</p>}
            </div>
        </div>
        <div className="col-span-12 md:col-span-3">
          <label htmlFor="lingkarPerut" className="block text-sm font-medium text-gray-700">47. Lingkar Perut (cm)</label>
          <input type="number" id="lingkarPerut" value={formData.lingkarPerut || ''} onChange={(e) => handleChange('lingkarPerut', e.target.value)} disabled={isLocked} className={errorInputClasses('lingkarPerut')} />
          {errors.lingkarPerut && <p className="mt-1 text-sm text-red-600">{errors.lingkarPerut}</p>}
        </div>

        {/* Ciri Fisik */}
         <div className="col-span-12 md:col-span-3">
          <label htmlFor="warnaRambut" className="block text-sm font-medium text-gray-700">48. Warna Rambut</label>
          <input type="text" id="warnaRambut" value={formData.warnaRambut || ''} onChange={(e) => handleChange('warnaRambut', e.target.value)} disabled={isLocked} className={errorInputClasses('warnaRambut')} />
          {errors.warnaRambut && <p className="mt-1 text-sm text-red-600">{errors.warnaRambut}</p>}
        </div>
         <div className="col-span-12 md:col-span-3">
          <label htmlFor="warnaMata" className="block text-sm font-medium text-gray-700">49. Warna Mata</label>
          <input type="text" id="warnaMata" value={formData.warnaMata || ''} onChange={(e) => handleChange('warnaMata', e.target.value)} disabled={isLocked} className={errorInputClasses('warnaMata')} />
          {errors.warnaMata && <p className="mt-1 text-sm text-red-600">{errors.warnaMata}</p>}
        </div>
        <div className="col-span-12">
          <label htmlFor="tandaIdentifikasiLain" className="block text-sm font-medium text-gray-700">50. Tanda Identifikasi Lain</label>
          <input type="text" id="tandaIdentifikasiLain" value={formData.tandaIdentifikasiLain || ''} onChange={(e) => handleChange('tandaIdentifikasiLain', e.target.value)} disabled={isLocked} className={inputClasses} />
        </div>
      </div>
    </div>
  );
};

export default VitalsSection;
