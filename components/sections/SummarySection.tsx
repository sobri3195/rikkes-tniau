
import React, { useState, useEffect } from 'react';
import { SectionCode, SectionStatus, UserRole, ResumeData } from '../../types';
import SectionHeader from './SectionHeader';

interface SummarySectionProps {
  sectionData: { data: ResumeData, status: SectionStatus, revisionReason?: string };
  onUpdate: (sectionCode: SectionCode, data: any, status?: SectionStatus) => void;
  userRole: UserRole;
  onRevert: (sectionCode: SectionCode, reason: string) => Promise<void>;
}

const initialFormData: ResumeData = {
    statusFisik: [],
    kualifikasi: '',
    kodeTugas: [],
    resume: '',
    kesimpulan: '',
    rekomendasi: '',
    dokterPemeriksa: { nama: '', jabatan: '' },
    penanggungJawab: { nama: '', pangkat: '', jabatan: '' }
};

const STATUS_FISIK_OPTIONS = ['U','A','B','D','L','G','J'];
const KUALIFIKASI_OPTIONS = ['I','II','III','IV'];
const KODE_TUGAS_OPTIONS = ['PINBANG AKTIF', 'AP. LAIN', 'PASUKAN KHUSUS', 'MILITER BIASA', 'SIPIL'];
const KESIMPULAN_OPTIONS = ['BAIK', 'BAIK DENGAN CATATAN', 'TIDAK BAIK'];

const SummarySection: React.FC<SummarySectionProps> = ({ sectionData, onUpdate, userRole, onRevert }) => {
  const [formData, setFormData] = useState<ResumeData>(sectionData.data || initialFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [feedback, setFeedback] = useState<string | null>(null);
  const isLocked = sectionData.status === SectionStatus.Submitted && userRole !== UserRole.Admin;

  useEffect(() => {
    setFormData(sectionData.data || initialFormData);
  }, [sectionData]);

  const handleChange = (field: keyof ResumeData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    clearError(field);
  };

  const handleNestedChange = (parent: 'dokterPemeriksa' | 'penanggungJawab', field: string, value: string) => {
      setFormData(prev => ({...prev, [parent]: {...prev[parent], [field]: value}}));
      clearError(parent, field);
  }

  const handleCheckboxChange = (field: 'statusFisik' | 'kodeTugas', value: string) => {
      setFormData(prev => {
          const currentValues = prev[field] || [];
          const newValues = currentValues.includes(value)
            ? currentValues.filter(item => item !== value)
            : [...currentValues, value];
          return {...prev, [field]: newValues};
      });
      clearError(field);
  }

  const clearError = (field: string, subField?: string) => {
      if (subField) {
        if (errors[field]?.[subField]) {
            setErrors((prev: any) => {
                const newSubErrors = {...prev[field]};
                delete newSubErrors[subField];
                return {...prev, [field]: newSubErrors};
            });
        }
      } else if (errors[field]) {
          setErrors(prev => {
              const newErrors = {...prev};
              delete newErrors[field];
              return newErrors;
          });
      }
  }

  const validate = (): any => {
      const newErrors: any = {};
      if (!formData.statusFisik || formData.statusFisik.length === 0) newErrors.statusFisik = "Pilih minimal satu status fisik.";
      if (!formData.kualifikasi) newErrors.kualifikasi = "Kualifikasi wajib dipilih.";
      if (!formData.kodeTugas || formData.kodeTugas.length === 0) newErrors.kodeTugas = "Pilih minimal satu kode tugas.";
      if (!formData.resume.trim()) newErrors.resume = "Resume wajib diisi.";
      if (!formData.kesimpulan) newErrors.kesimpulan = "Kesimpulan wajib dipilih.";
      if (!formData.rekomendasi.trim()) newErrors.rekomendasi = "Rekomendasi wajib diisi.";

      if (!formData.dokterPemeriksa.nama.trim()) newErrors.dokterPemeriksa = { ...(newErrors.dokterPemeriksa || {}), nama: "Nama dokter wajib diisi." };
      if (!formData.penanggungJawab.nama.trim()) newErrors.penanggungJawab = { ...(newErrors.penanggungJawab || {}), nama: "Nama penanggung jawab wajib diisi." };
      if (!formData.penanggungJawab.pangkat.trim()) newErrors.penanggungJawab = { ...(newErrors.penanggungJawab || {}), pangkat: "Pangkat wajib diisi." };
      
      return newErrors;
  }

  const showFeedback = (message: string) => {
    setFeedback(message);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
        await onUpdate(SectionCode.Resume, formData);
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
        await onUpdate(SectionCode.Resume, formData, SectionStatus.Submitted);
        showFeedback('✔️ Bagian berhasil diserahkan!');
    } catch (err) {
        showFeedback(`❌ Gagal menyerahkan: ${(err as Error).message}`);
    } finally {
        setIsSaving(false);
    }
  };

  const handleRevert = (reason: string) => {
    return onRevert(SectionCode.Resume, reason);
  }
  
  const inputClasses = (error: boolean) => 
    `mt-1 block w-full rounded-md shadow-sm sm:text-sm disabled:bg-gray-100 ${error ? 'border-red-500' : 'border-gray-300'}`;

  return (
    <div>
      <SectionHeader 
        title="Resume & Rekomendasi (60-67)"
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
        
        <div className="grid grid-cols-12 gap-6 p-4 border rounded-lg shadow-sm">
            <div className="col-span-12 md:col-span-5">
                <label className="block text-sm font-medium text-gray-700">60. Status Fisik</label>
                <div className={`mt-2 flex flex-wrap gap-4 p-2 rounded-md border ${errors.statusFisik ? 'border-red-500' : 'border-gray-200'}`}>
                    {STATUS_FISIK_OPTIONS.map(opt => (
                        <div key={opt} className="flex items-center">
                            <input type="checkbox" id={`sf-${opt}`} checked={formData.statusFisik.includes(opt)} onChange={() => handleCheckboxChange('statusFisik', opt)} disabled={isLocked} className="h-4 w-4 rounded border-gray-300 text-tni-au focus:ring-tni-au" />
                            <label htmlFor={`sf-${opt}`} className="ml-2 block text-sm text-gray-900">{opt}</label>
                        </div>
                    ))}
                </div>
                {errors.statusFisik && <p className="mt-1 text-sm text-red-600">{errors.statusFisik}</p>}
            </div>
            <div className="col-span-12 md:col-span-3">
                <label className="block text-sm font-medium text-gray-700">61. Kualifikasi</label>
                 <div className={`mt-2 flex flex-wrap gap-4 p-2 rounded-md border ${errors.kualifikasi ? 'border-red-500' : 'border-gray-200'}`}>
                    {KUALIFIKASI_OPTIONS.map(opt => (
                        <div key={opt} className="flex items-center">
                            <input type="radio" id={`kual-${opt}`} name="kualifikasi" value={opt} checked={formData.kualifikasi === opt} onChange={(e) => handleChange('kualifikasi', e.target.value)} disabled={isLocked} className="h-4 w-4 border-gray-300 text-tni-au focus:ring-tni-au" />
                            <label htmlFor={`kual-${opt}`} className="ml-2 block text-sm text-gray-900">{opt}</label>
                        </div>
                    ))}
                </div>
                {errors.kualifikasi && <p className="mt-1 text-sm text-red-600">{errors.kualifikasi}</p>}
            </div>
            <div className="col-span-12 md:col-span-4">
                <label className="block text-sm font-medium text-gray-700">62. Kode Tugas</label>
                <div className={`mt-2 grid grid-cols-2 gap-2 p-2 rounded-md border h-full ${errors.kodeTugas ? 'border-red-500' : 'border-gray-200'}`}>
                    {KODE_TUGAS_OPTIONS.map(opt => (
                        <div key={opt} className="flex items-center">
                            <input type="checkbox" id={`kt-${opt}`} checked={(formData.kodeTugas || []).includes(opt)} onChange={() => handleCheckboxChange('kodeTugas', opt)} disabled={isLocked} className="h-4 w-4 rounded border-gray-300 text-tni-au focus:ring-tni-au" />
                            <label htmlFor={`kt-${opt}`} className="ml-2 block text-sm text-gray-900">{opt}</label>
                        </div>
                    ))}
                </div>
                {errors.kodeTugas && <p className="mt-1 text-sm text-red-600">{errors.kodeTugas}</p>}
            </div>
        </div>
        

        <div>
          <label htmlFor="resume" className="block text-sm font-medium text-gray-700">63. Resume (Tulis Kelainan / Diagnosis / Stakes sesuai nomor)</label>
          <textarea id="resume" rows={5} className={inputClasses(!!errors.resume)}
            value={formData.resume}
            onChange={e => handleChange('resume', e.target.value)}
            disabled={isLocked}
          />
          {errors.resume && <p className="mt-1 text-sm text-red-600">{errors.resume}</p>}
        </div>

        <div>
            <label htmlFor="kesimpulan" className="block text-sm font-medium text-gray-700">64. Kesimpulan</label>
            <select id="kesimpulan" value={formData.kesimpulan} onChange={(e) => handleChange('kesimpulan', e.target.value)} disabled={isLocked} className={inputClasses(!!errors.kesimpulan)}>
                <option value="">Pilih kesimpulan...</option>
                {KESIMPULAN_OPTIONS.map(opt => <option key={opt} value={opt}>{opt.replace('BAIK DENGAN CATATAN', 'BAIK')}</option>)}
            </select>
             {errors.kesimpulan && <p className="mt-1 text-sm text-red-600">{errors.kesimpulan}</p>}
        </div>

        <div>
          <label htmlFor="rekomendasi" className="block text-sm font-medium text-gray-700">65. Rekomendasi (Tindak lanjut, Follow Up, Disposisi Aeromedis)</label>
          <textarea id="rekomendasi" rows={3} className={inputClasses(!!errors.rekomendasi)}
            value={formData.rekomendasi}
            onChange={e => handleChange('rekomendasi', e.target.value)}
            disabled={isLocked}
          />
           {errors.rekomendasi && <p className="mt-1 text-sm text-red-600">{errors.rekomendasi}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
            <div>
                 <h4 className="font-semibold text-gray-800">66. Dokter Pemeriksa</h4>
                 <div className="mt-2 space-y-2">
                     <label htmlFor="dokterNama" className="text-sm">Nama</label>
                     <input type="text" id="dokterNama" value={formData.dokterPemeriksa.nama} onChange={(e) => handleNestedChange('dokterPemeriksa', 'nama', e.target.value)} disabled={isLocked} className={inputClasses(!!errors.dokterPemeriksa?.nama)} />
                     {errors.dokterPemeriksa?.nama && <p className="mt-1 text-sm text-red-600">{errors.dokterPemeriksa.nama}</p>}
                      <label htmlFor="dokterJabatan" className="text-sm">Jabatan</label>
                     <input type="text" id="dokterJabatan" value={formData.dokterPemeriksa.jabatan} onChange={(e) => handleNestedChange('dokterPemeriksa', 'jabatan', e.target.value)} disabled={isLocked} className={inputClasses(false)} />
                 </div>
            </div>
            <div>
                 <h4 className="font-semibold text-gray-800">67. Disyahkan / Diketahui Oleh</h4>
                 <div className="mt-2 space-y-2">
                     <label htmlFor="pjNama" className="text-sm">Nama</label>
                     <input type="text" id="pjNama" value={formData.penanggungJawab.nama} onChange={(e) => handleNestedChange('penanggungJawab', 'nama', e.target.value)} disabled={isLocked} className={inputClasses(!!errors.penanggungJawab?.nama)} />
                     {errors.penanggungJawab?.nama && <p className="mt-1 text-sm text-red-600">{errors.penanggungJawab.nama}</p>}
                      <label htmlFor="pjPangkat" className="text-sm">Pangkat</label>
                     <input type="text" id="pjPangkat" value={formData.penanggungJawab.pangkat} onChange={(e) => handleNestedChange('penanggungJawab', 'pangkat', e.target.value)} disabled={isLocked} className={inputClasses(!!errors.penanggungJawab?.pangkat)} />
                     {errors.penanggungJawab?.pangkat && <p className="mt-1 text-sm text-red-600">{errors.penanggungJawab.pangkat}</p>}
                      <label htmlFor="pjJabatan" className="text-sm">Jabatan</label>
                     <input type="text" id="pjJabatan" value={formData.penanggungJawab.jabatan} onChange={(e) => handleNestedChange('penanggungJawab', 'jabatan', e.target.value)} disabled={isLocked} className={inputClasses(false)} />
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SummarySection;
