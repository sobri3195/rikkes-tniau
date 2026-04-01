<?php

declare(strict_types=1);

namespace Rikkes\Infrastructure;

use Rikkes\Domain\RikkesTypes;

final class InMemoryRikkesRepository
{
    /** @var array<string, array<string, mixed>> */
    private array $persons;

    /** @var array<string, array<string, mixed>> */
    private array $exams;

    public function __construct()
    {
        $this->persons = [
            'p1' => [
                'id' => 'p1',
                'nrp' => '512345',
                'name' => 'Budi Santoso',
                'rank' => 'Serma',
                'unit' => 'Skadron Udara 3',
                'dob' => '1985-05-20',
                'address' => 'Jl. Rajawali No. 1, Komplek Halim P.',
                'religion' => 'Islam',
                'gender' => 'Laki-laki',
                'pemberitahuan' => 'Siti Aminah (Istri)',
            ],
        ];

        $this->exams = [
            'exam1' => [
                'id' => 'exam1',
                'personId' => 'p1',
                'purpose' => 'Pemeriksaan Berkala Tahunan',
                'status' => RikkesTypes::EXAM_STATUS_IN_PROGRESS,
                'sections' => RikkesTypes::createNewExamSections('Pemeriksaan Berkala Tahunan'),
            ],
        ];
    }

    /** @return list<array<string, mixed>> */
    public function getExams(): array
    {
        return array_values($this->exams);
    }

    /** @return list<array<string, mixed>> */
    public function getPersons(): array
    {
        return array_values($this->persons);
    }

    /** @return array<string, mixed>|null */
    public function findExamById(string $examId): ?array
    {
        return $this->exams[$examId] ?? null;
    }

    /** @param array<string, mixed> $exam */
    public function updateExam(string $examId, array $exam): bool
    {
        if (!isset($this->exams[$examId])) {
            return false;
        }

        $this->exams[$examId] = $exam;

        return true;
    }

    /**
     * @param array<string, mixed> $personPayload
     * @return array<string, mixed>
     */
    public function addExamAndPerson(array $personPayload, string $examPurpose): array
    {
        $suffix = (string) time();
        $personId = 'p' . $suffix;
        $examId = 'exam' . $suffix;

        $person = $personPayload;
        $person['id'] = $personId;

        $exam = [
            'id' => $examId,
            'personId' => $personId,
            'purpose' => $examPurpose,
            'status' => RikkesTypes::EXAM_STATUS_IN_PROGRESS,
            'sections' => RikkesTypes::createNewExamSections($examPurpose),
        ];

        $this->persons[$personId] = $person;
        $this->exams[$examId] = $exam;

        return [
            'person' => $person,
            'exam' => $exam,
        ];
    }
}
