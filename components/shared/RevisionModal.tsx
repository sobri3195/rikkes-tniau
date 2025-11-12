
import React, { useState } from 'react';

interface RevisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => Promise<void>;
}

const RevisionModal: React.FC<RevisionModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reason.trim()) {
      setError('Alasan revisi wajib diisi.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
        await onSubmit(reason);
        onClose();
    } catch (err) {
        setError(`Gagal mengembalikan: ${(err as Error).message}`);
    } finally {
        setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900">Kembalikan ke Draft</h3>
          <p className="mt-2 text-sm text-gray-600">
            Silakan berikan alasan mengapa bagian ini perlu direvisi. Alasan ini akan ditampilkan kepada spesialis terkait.
          </p>
          <div className="mt-4">
            <textarea
              rows={4}
              className={`w-full p-2 border rounded-md ${error ? 'border-red-500' : 'border-gray-300'}`}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError('');
              }}
              placeholder="Contoh: Data ECG tidak lengkap, mohon diisi kembali."
            />
            {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3">
          <button type="button" onClick={onClose} disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50">
            Batal
          </button>
          <button onClick={handleSubmit} disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 disabled:opacity-50">
            {isSubmitting ? 'Mengembalikan...' : 'Konfirmasi & Kembalikan'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RevisionModal;
