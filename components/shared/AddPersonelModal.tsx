
import React, { useState, useEffect } from 'react';
import { Person } from '../../types';

interface AddPersonelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPersonel: (personData: Omit<Person, 'id'>, purpose: string) => Promise<void>;
}

const initialFormData = {
    name: '',
    nrp: '',
    rank: '',
    unit: '',
    dob: '',
    address: '',
    religion: '',
    gender: 'Laki-laki' as 'Laki-laki' | 'Perempuan',
    pemberitahuan: '',
    purpose: ''
};

const AddPersonelModal: React.FC<AddPersonelModalProps> = ({ isOpen, onClose, onAddPersonel }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof initialFormData, string>>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{message: string; type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal is closed
      setFormData(initialFormData);
      setErrors({});
      setIsSaving(false);
      setFeedback(null);
    }
  }, [isOpen]);

  const handleChange = (field: keyof typeof initialFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof typeof initialFormData, string>> = {};
    const requiredFields: (keyof typeof initialFormData)[] = ['name', 'nrp', 'rank', 'unit', 'dob', 'purpose'];
    
    requiredFields.forEach(field => {
      if (!formData[field].trim()) {
        newErrors[field] = 'Kolom ini wajib diisi.';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    setIsSaving(true);
    setFeedback(null);
    try {
      const { purpose, ...personData } = formData;
      await onAddPersonel(personData, purpose);
      setFeedback({ message: 'Personel berhasil ditambahkan!', type: 'success' });
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      setFeedback({ message: `Gagal: ${(error as Error).message}`, type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  const inputClasses = (field: keyof typeof initialFormData) =>
    `mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-tni-au disabled:bg-gray-100 ${
      errors[field] ? 'border-red-500' : 'border-gray-300'
    }`;
    
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-tni-au-dark mb-1">Tambah Personel Baru</h2>
            <p className="text-gray-600 mb-6">Isi detail di bawah ini untuk membuat catatan personel dan pemeriksaan baru.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* Person Data */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                <input type="text" id="name" value={formData.name} onChange={e => handleChange('name', e.target.value)} className={inputClasses('name')} />
                {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="nrp" className="block text-sm font-medium text-gray-700">NRP</label>
                <input type="text" id="nrp" value={formData.nrp} onChange={e => handleChange('nrp', e.target.value)} className={inputClasses('nrp')} />
                {errors.nrp && <p className="text-red-600 text-sm mt-1">{errors.nrp}</p>}
              </div>
              <div>
                <label htmlFor="rank" className="block text-sm font-medium text-gray-700">Pangkat</label>
                <input type="text" id="rank" value={formData.rank} onChange={e => handleChange('rank', e.target.value)} className={inputClasses('rank')} />
                {errors.rank && <p className="text-red-600 text-sm mt-1">{errors.rank}</p>}
              </div>
              <div>
                <label htmlFor="unit" className="block text-sm font-medium text-gray-700">Kesatuan / Jabatan</label>
                <input type="text" id="unit" value={formData.unit} onChange={e => handleChange('unit', e.target.value)} className={inputClasses('unit')} />
                {errors.unit && <p className="text-red-600 text-sm mt-1">{errors.unit}</p>}
              </div>
              <div>
                <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Tanggal Lahir</label>
                <input type="date" id="dob" value={formData.dob} onChange={e => handleChange('dob', e.target.value)} className={inputClasses('dob')} />
                {errors.dob && <p className="text-red-600 text-sm mt-1">{errors.dob}</p>}
              </div>
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Jenis Kelamin</label>
                <select id="gender" value={formData.gender} onChange={e => handleChange('gender', e.target.value)} className={inputClasses('gender')}>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Alamat Rumah</label>
                <input type="text" id="address" value={formData.address} onChange={e => handleChange('address', e.target.value)} className={inputClasses('address')} />
              </div>
              <div>
                <label htmlFor="religion" className="block text-sm font-medium text-gray-700">Agama</label>
                <input type="text" id="religion" value={formData.religion} onChange={e => handleChange('religion', e.target.value)} className={inputClasses('religion')} />
              </div>
              <div>
                <label htmlFor="pemberitahuan" className="block text-sm font-medium text-gray-700">Nama Ayah/Ibu/Wali</label>
                <input type="text" id="pemberitahuan" value={formData.pemberitahuan} onChange={e => handleChange('pemberitahuan', e.target.value)} className={inputClasses('pemberitahuan')} />
              </div>

              {/* Exam Data */}
              <div className="md:col-span-2 pt-4 border-t mt-2">
                 <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">Maksud Pemeriksaan</label>
                <input type="text" id="purpose" value={formData.purpose} onChange={e => handleChange('purpose', e.target.value)} className={inputClasses('purpose')} />
                {errors.purpose && <p className="text-red-600 text-sm mt-1">{errors.purpose}</p>}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
             {feedback && (
                <p className={`text-sm font-semibold ${feedback.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                    {feedback.message}
                </p>
             )}
             <div className="flex-grow flex justify-end space-x-3">
                 <button type="button" onClick={onClose} disabled={isSaving} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50">
                    Batal
                </button>
                <button type="submit" disabled={isSaving} className="px-4 py-2 text-sm font-medium text-white bg-tni-au border border-transparent rounded-md shadow-sm hover:bg-tni-au-dark disabled:opacity-50">
                    {isSaving ? 'Menyimpan...' : 'Simpan Personel'}
                </button>
             </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPersonelModal;
