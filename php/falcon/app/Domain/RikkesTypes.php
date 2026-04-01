<?php

declare(strict_types=1);

namespace Rikkes\Domain;

final class RikkesTypes
{
    public const USER_ROLE_ADMIN = 'admin';
    public const USER_ROLE_DOKTER_UMUM = 'dokter_umum';
    public const USER_ROLE_DOKTER_GIGI = 'dokter_gigi';
    public const USER_ROLE_ATLM_LAB = 'atlm_lab';
    public const USER_ROLE_RADIOGRAFER = 'radiografer';
    public const USER_ROLE_REVIEWER = 'reviewer';

    public const EXAM_STATUS_IN_PROGRESS = 'In Progress';
    public const EXAM_STATUS_PENDING_REVIEW = 'Pending Review';
    public const EXAM_STATUS_FINALIZED = 'Finalized';
    public const EXAM_STATUS_REVISION_NEEDED = 'Revision Needed';

    public const SECTION_STATUS_DRAFT = 'Draft';
    public const SECTION_STATUS_SUBMITTED = 'Submitted';

    public const SECTION_IDENTITAS = 'identitas';
    public const SECTION_KLINIS = 'klinis';
    public const SECTION_GIGI = 'gigi';
    public const SECTION_VITAL = 'vital';
    public const SECTION_MATA_THT = 'mata_tht';
    public const SECTION_PENUNJANG = 'penunjang';
    public const SECTION_LAB = 'lab';
    public const SECTION_RESUME = 'resume';

    /** @return list<string> */
    public static function sectionCodes(): array
    {
        return [
            self::SECTION_IDENTITAS,
            self::SECTION_KLINIS,
            self::SECTION_GIGI,
            self::SECTION_VITAL,
            self::SECTION_MATA_THT,
            self::SECTION_PENUNJANG,
            self::SECTION_LAB,
            self::SECTION_RESUME,
        ];
    }

    /**
     * Meniru createNewExamSections di hooks/useMockApi.ts.
     *
     * @return array<string, array<string, mixed>>
     */
    public static function createNewExamSections(string $purpose): array
    {
        $now = gmdate('c');
        $today = gmdate('Y-m-d');

        $sections = [];

        foreach (self::sectionCodes() as $code) {
            $sections[$code] = [
                'code' => $code,
                'status' => self::SECTION_STATUS_DRAFT,
                'lastUpdated' => $now,
                'updatedBy' => self::USER_ROLE_ADMIN,
                'data' => [],
            ];
        }

        $sections[self::SECTION_IDENTITAS]['data'] = [
            'maksudPemeriksaan' => $purpose,
            'tanggalPemeriksaan' => $today,
            'masaKerjaMiliter' => '0 Tahun',
            'masaKerjaSipil' => '0 Tahun',
            'anamnesis' => 'Pasien baru, belum ada riwayat.',
        ];

        return $sections;
    }
}
