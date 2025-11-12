
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Exam, Person, UserRole, SectionCode, ExamStatus, SectionStatus, IdentityData } from '../types';
import { MOCK_EXAMS, MOCK_PERSONS } from '../constants';

// Helper to simulate API call with potential failure
const simulateApiCall = <T,>(data: T, successRate = 0.9): Promise<T> => {
    return new Promise<T>((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() < successRate) {
                resolve(data);
            } else {
                reject(new Error("Terjadi kesalahan jaringan. Silakan coba lagi."));
            }
        }, 300 + Math.random() * 500); // variable delay
    });
};


// Helper function to create initial sections for a new exam
const createNewExamSections = (purpose: string): Record<SectionCode, any> => {
    const defaultRole = UserRole.Admin; 
    const now = new Date().toISOString();
    const today = now.split('T')[0];
    
    // Create a base structure for all sections
    const baseSections = Object.values(SectionCode).reduce((acc, code) => {
        acc[code] = {
            code,
            status: SectionStatus.Draft,
            lastUpdated: now,
            updatedBy: defaultRole,
            data: {}, // Start with empty data
        };
        return acc;
    }, {} as Record<SectionCode, any>);

    // Pre-fill identity data since we have it from the form
    baseSections[SectionCode.Identitas].data = {
        maksudPemeriksaan: purpose,
        tanggalPemeriksaan: today,
        masaKerjaMiliter: '0 Tahun',
        masaKerjaSipil: '0 Tahun',
        anamnesis: 'Pasien baru, belum ada riwayat.'
    } as IdentityData;
    
    return baseSections;
};

export const useMockApi = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate initial data fetch
    setLoading(true);
    setError(null);
    simulateApiCall({ exams: MOCK_EXAMS, persons: MOCK_PERSONS }, 0.98) // High success rate for initial load
        .then(data => {
            setExams(data.exams);
            setPersons(data.persons);
        })
        .catch(err => {
            console.error("Failed to fetch initial data:", err);
            setError("Gagal memuat data awal. Silakan segarkan halaman untuk mencoba lagi.");
        })
        .finally(() => {
            setLoading(false);
        });
  }, []);

  const personLookup = useMemo(() => {
      return persons.reduce((acc, person) => {
          acc[person.id] = person;
          return acc;
      }, {} as Record<string, Person>);
  }, [persons]);

  const getExamById = useCallback((examId: string): Exam | undefined => {
    return exams.find(exam => exam.id === examId);
  }, [exams]);

  const updateExam = useCallback((updatedExam: Exam) => {
    return simulateApiCall(updatedExam)
        .then(data => {
            setExams(prevExams => 
                prevExams.map(exam => exam.id === updatedExam.id ? updatedExam : exam)
            );
            return data;
        })
        .catch(err => {
            console.error("Failed to update exam:", err);
            // Re-throw to be caught by the component
            throw new Error("Gagal memperbarui data pemeriksaan.");
        });
  }, []);
  
  const addExamAndPerson = useCallback((newPersonData: Omit<Person, 'id'>, examPurpose: string) => {
      return new Promise<void>((resolve, reject) => {
          const newPersonId = `p${Date.now()}`;
          const newExamId = `exam${Date.now()}`;

          const newPerson: Person = {
              ...newPersonData,
              id: newPersonId,
          };

          const newExam: Exam = {
              id: newExamId,
              personId: newPersonId,
              purpose: examPurpose,
              status: ExamStatus.InProgress,
              sections: createNewExamSections(examPurpose),
          };
          
          simulateApiCall({ newPerson, newExam })
            .then(data => {
                setPersons(prev => [...prev, data.newPerson]);
                setExams(prev => [data.newExam, ...prev]);
                resolve();
            })
            .catch(err => {
                console.error("Failed to add personel and exam:", err);
                reject(new Error("Gagal menambahkan personel baru."));
            });
      });
  }, []);


  return { exams, getExamById, updateExam, loading, personLookup, addExamAndPerson, error };
};
