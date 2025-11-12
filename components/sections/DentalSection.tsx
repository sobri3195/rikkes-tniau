
import React, { useState, useEffect, useMemo } from 'react';
import { DentalData, SectionCode, SectionStatus, UserRole, OdontogramToothState } from '../../types';
import Odontogram from '../shared/Odontogram';
import SectionHeader from './SectionHeader';

interface DentalSectionProps {
  sectionData: { data: DentalData, status: SectionStatus, revisionReason?: string };
  onUpdate: (sectionCode: SectionCode, data: DentalData, status?: SectionStatus) => void;
  userRole: UserRole;
  onRevert: (sectionCode: SectionCode, reason: string) => Promise<void>;
}

const initialFormData: DentalData = {
    odontogram: {},
    stakes: '',
    catatan: {
        oklusi: '',
        kebersihanMulut: '',
        frekuensiSikatGigi: '',
        kelainanDalamMulut: '',
        karangGigi: '',
        diagnosaKelainan: '',
        dmf: 0,
        jumlahGigiVital: '',
        jumlahTitikKontak: '',
        fissureStain: ''
    }
};

type ErrorType = {
    stakes?: string;
    catatan?: Partial<Record<keyof DentalData['catatan'], string>>;
}

const DentalSection: React.FC<DentalSectionProps> = ({ sectionData, onUpdate, userRole, onRevert }) => {
  const [formData, setFormData] = useState<DentalData>(sectionData.data || initialFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<ErrorType>({});
  const [feedback, setFeedback] = useState<string | null>(null);
  const isLocked = sectionData.status === SectionStatus.Submitted && userRole !== UserRole.Admin;

  useEffect(() => {
    setFormData(sectionData.data || initialFormData);
  }, [sectionData]);
  
  const dmfScore = useMemo(() => {
    if (!formData.odontogram) return 0;
    const values = Object.values(formData.odontogram);
    const decayed = values.filter(v => v === OdontogramToothState.Karies).length;
    const missing = values.filter(v => v === OdontogramToothState.Hilang).length;
    const filled = values.filter(v => v === OdontogramToothState.TambalanAmalgam || v === OdontogramToothState.TambalanLain).length;
    return decayed + missing + filled;
  }, [formData.odontogram]);

  useEffect(() => {
    if (dmfScore !== formData.catatan.dmf) {
      handleCatatanChange('dmf', dmfScore);
    }
  }, [dmfScore, formData.catatan.dmf]);


  const handleOdontogramUpdate = (newOdontogram: any) => {
    setFormData(prev => ({ ...prev, odontogram: newOdontogram }));
  };

  const handleCatatanChange = (field: keyof DentalData['catatan'], value: any) => {
    setFormData(prev => ({ ...prev, catatan: { ...prev.catatan, [field]: value } }));
    if (errors.catatan?.[field]) {
        setErrors(prev => ({ ...prev, catatan: {...prev.catatan, [field]: undefined }}));
    }
  };
  
  const handleStakesChange = (value: string) => {
      setFormData(prev => ({...prev, stakes: value}));
      if (errors.stakes) {
        setErrors(prev => ({...prev, stakes: undefined}));
      }
  }

  const validate = (): ErrorType => {
    const newErrors: ErrorType = { catatan: {} };
    if (!formData.stakes.trim()) newErrors.stakes = "STAKES wajib diisi.";
    if (!formData.catatan.oklusi.trim()) newErrors.catatan!.oklusi = "Oklusi wajib diisi.";
    if (!formData.catatan.kebersihanMulut.trim()) newErrors.catatan!.kebersihanMulut = "Kebersihan mulut wajib diisi.";
    if (!formData.catatan.karangGigi) newErrors.catatan!.karangGigi = "Karang gigi wajib dipilih.";
    
    if (Object.keys(newErrors.catatan!).length === 0) {
        delete newErrors.catatan;
    }
    return newErrors;
  }

  const showFeedback = (message: string) => {
    setFeedback(message);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
        await onUpdate(SectionCode.Gigi, formData);
        showFeedback('✔️ Draft berhasil disimpan!');
    } catch (err) {
        showFeedback(`❌ Gagal menyimpan: ${(err as Error).message}`);
    } finally {
        setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0 || (validationErrors.catatan && Object.keys(validationErrors.catatan).length > 0)) {
        setErrors(validationErrors);
        return;
    }
    setErrors({});
    setIsSaving(true);
    try {
        await onUpdate(SectionCode.Gigi, formData, SectionStatus.Submitted);
        showFeedback('✔️ Bagian berhasil diserahkan!');
    } catch (err) {
        showFeedback(`❌ Gagal menyerahkan: ${(err as Error).message}`);
    } finally {
        setIsSaving(false);
    }
  };

  const handleRevert = (reason: string) => {
    return onRevert(SectionCode.Gigi, reason);
  }
  
  const inputClasses = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-tni-au focus:ring-tni-au sm:text-sm disabled:bg-gray-100";

  return (
    <div>
      <SectionHeader 
        title="Gigi & Odontogram (35)"
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
      <div className="mt-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Odontogram Interaktif</h4>
        <Odontogram data={formData.odontogram} onUpdate={handleOdontogramUpdate} disabled={isLocked} />
      </div>

      <div className="mt-8">
        <h4 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Kualifikasi & Catatan</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-4">
            <div className="md:col-span-1">
                <label htmlFor="stakes" className="block text-sm font-medium text-gray-700">STAKES</label>
                <input type="text" id="stakes" value={formData.stakes || ''} onChange={(e) => handleStakesChange(e.target.value)} disabled={isLocked} className={`${inputClasses} ${errors.stakes ? 'border-red-500' : 'border-gray-300'}`} />
                {errors.stakes && <p className="mt-1 text-sm text-red-600">{errors.stakes}</p>}
            </div>
            <div className="md:col-span-1">
                <label htmlFor="dmf" className="block text-sm font-medium text-gray-700">DMF-T</label>
                <input type="number" id="dmf" value={formData.catatan.dmf || 0} readOnly className={`${inputClasses} bg-gray-100`} />
            </div>
             <div className="md:col-span-2">
                <label htmlFor="oklusi" className="block text-sm font-medium text-gray-700">Oklusi</label>
                <input type="text" id="oklusi" value={formData.catatan.oklusi || ''} onChange={(e) => handleCatatanChange('oklusi', e.target.value)} disabled={isLocked} className={`${inputClasses} ${errors.catatan?.oklusi ? 'border-red-500' : 'border-gray-300'}`} />
                {errors.catatan?.oklusi && <p className="mt-1 text-sm text-red-600">{errors.catatan.oklusi}</p>}
            </div>
             <div>
                <label htmlFor="kebersihanMulut" className="block text-sm font-medium text-gray-700">Kebersihan Mulut</label>
                <input type="text" id="kebersihanMulut" value={formData.catatan.kebersihanMulut || ''} onChange={(e) => handleCatatanChange('kebersihanMulut', e.target.value)} disabled={isLocked} className={`${inputClasses} ${errors.catatan?.kebersihanMulut ? 'border-red-500' : 'border-gray-300'}`} />
                {errors.catatan?.kebersihanMulut && <p className="mt-1 text-sm text-red-600">{errors.catatan.kebersihanMulut}</p>}
            </div>
            <div>
                <label htmlFor="frekuensiSikatGigi" className="block text-sm font-medium text-gray-700">Frekuensi Sikat Gigi</label>
                <input type="text" id="frekuensiSikatGigi" value={formData.catatan.frekuensiSikatGigi || ''} onChange={(e) => handleCatatanChange('frekuensiSikatGigi', e.target.value)} disabled={isLocked} className={inputClasses} />
            </div>
             <div>
                <label htmlFor="jumlahGigiVital" className="block text-sm font-medium text-gray-700">Jumlah Gigi Vital</label>
                <input type="text" id="jumlahGigiVital" value={formData.catatan.jumlahGigiVital || ''} onChange={(e) => handleCatatanChange('jumlahGigiVital', e.target.value)} disabled={isLocked} className={inputClasses} />
            </div>
             <div>
                <label htmlFor="jumlahTitikKontak" className="block text-sm font-medium text-gray-700">Jml Titik Kontak</label>
                <input type="text" id="jumlahTitikKontak" value={formData.catatan.jumlahTitikKontak || ''} onChange={(e) => handleCatatanChange('jumlahTitikKontak', e.target.value)} disabled={isLocked} className={inputClasses} />
            </div>
            <div>
                <label htmlFor="karangGigi" className="block text-sm font-medium text-gray-700">Karang Gigi</label>
                <select id="karangGigi" value={formData.catatan.karangGigi || ''} onChange={(e) => handleCatatanChange('karangGigi', e.target.value)} disabled={isLocked} className={`${inputClasses} ${errors.catatan?.karangGigi ? 'border-red-500' : 'border-gray-300'}`}>
                    <option value="">Pilih...</option>
                    <option value="Ada">Ada</option>
                    <option value="Tidak Ada">Tidak Ada</option>
                </select>
                {errors.catatan?.karangGigi && <p className="mt-1 text-sm text-red-600">{errors.catatan.karangGigi}</p>}
            </div>
            <div>
                <label htmlFor="fissureStain" className="block text-sm font-medium text-gray-700">Fissure Stain</label>
                <input type="text" id="fissureStain" value={formData.catatan.fissureStain || ''} onChange={(e) => handleCatatanChange('fissureStain', e.target.value)} disabled={isLocked} className={inputClasses} />
            </div>
            <div className="md:col-span-2">
                <label htmlFor="kelainanDalamMulut" className="block text-sm font-medium text-gray-700">Kelainan Dalam Mulut</label>
                <input type="text" id="kelainanDalamMulut" value={formData.catatan.kelainanDalamMulut || ''} onChange={(e) => handleCatatanChange('kelainanDalamMulut', e.target.value)} disabled={isLocked} className={inputClasses} />
            </div>
            <div className="md:col-span-4">
                <label htmlFor="diagnosaKelainan" className="block text-sm font-medium text-gray-700">Diagnosa / Kelainan</label>
                <textarea id="diagnosaKelainan" rows={3} value={formData.catatan.diagnosaKelainan || ''} onChange={(e) => handleCatatanChange('diagnosaKelainan', e.target.value)} disabled={isLocked} className={inputClasses} />
            </div>
        </div>
      </div>
    </div>
  );
};

export default DentalSection;
