<?php

declare(strict_types=1);

namespace Rikkes\Controllers;

use Phalcon\Di\DiInterface;
use Phalcon\Http\Response;
use Rikkes\Infrastructure\InMemoryRikkesRepository;

final class ApiController
{
    public function __construct(private readonly DiInterface $di)
    {
    }

    public function examsAction(): Response
    {
        /** @var InMemoryRikkesRepository $repo */
        $repo = $this->di->getShared('repo');

        return $this->jsonResponse($repo->getExams());
    }

    public function examByIdAction(string $examId): Response
    {
        /** @var InMemoryRikkesRepository $repo */
        $repo = $this->di->getShared('repo');
        $exam = $repo->findExamById($examId);

        if ($exam === null) {
            return $this->jsonResponse(['message' => 'Exam tidak ditemukan.'], 404);
        }

        return $this->jsonResponse($exam);
    }

    public function personsAction(): Response
    {
        /** @var InMemoryRikkesRepository $repo */
        $repo = $this->di->getShared('repo');

        return $this->jsonResponse($repo->getPersons());
    }

    public function createExamAction(): Response
    {
        /** @var InMemoryRikkesRepository $repo */
        $repo = $this->di->getShared('repo');

        $payload = $this->requestJson();
        $person = $payload['person'] ?? null;
        $purpose = $payload['purpose'] ?? null;

        if (!is_array($person) || !is_string($purpose) || $purpose === '') {
            return $this->jsonResponse(['message' => 'Payload tidak valid.'], 422);
        }

        $created = $repo->addExamAndPerson($person, $purpose);

        return $this->jsonResponse($created, 201);
    }

    public function updateExamAction(string $examId): Response
    {
        /** @var InMemoryRikkesRepository $repo */
        $repo = $this->di->getShared('repo');
        $payload = $this->requestJson();

        if (!$repo->updateExam($examId, $payload)) {
            return $this->jsonResponse(['message' => 'Exam tidak ditemukan.'], 404);
        }

        return $this->jsonResponse(['message' => 'Exam berhasil diperbarui.']);
    }

    /** @return array<string, mixed> */
    private function requestJson(): array
    {
        $raw = file_get_contents('php://input');

        if (!is_string($raw) || $raw === '') {
            return [];
        }

        $decoded = json_decode($raw, true);

        return is_array($decoded) ? $decoded : [];
    }

    /** @param array<string, mixed>|list<array<string, mixed>> $data */
    private function jsonResponse(array $data, int $statusCode = 200): Response
    {
        $response = new Response();
        $response->setStatusCode($statusCode);
        $response->setHeader('Content-Type', 'application/json; charset=utf-8');
        $response->setJsonContent($data);

        return $response;
    }
}
