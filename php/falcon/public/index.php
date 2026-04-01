<?php

declare(strict_types=1);

use Phalcon\Autoload\Loader;
use Phalcon\Di\FactoryDefault;
use Phalcon\Mvc\Router;
use Rikkes\Controllers\ApiController;
use Rikkes\Infrastructure\InMemoryRikkesRepository;

require_once __DIR__ . '/../vendor/autoload.php';

$loader = new Loader();
$loader->setNamespaces([
    'Rikkes\\Controllers' => __DIR__ . '/../app/Controllers/',
    'Rikkes\\Domain' => __DIR__ . '/../app/Domain/',
    'Rikkes\\Infrastructure' => __DIR__ . '/../app/Infrastructure/',
]);
$loader->register();

$di = new FactoryDefault();
$di->setShared('repo', static fn () => new InMemoryRikkesRepository());

$router = new Router(false);
$router->addGet('/api/exams', ['action' => 'exams']);
$router->addGet('/api/exams/{examId}', ['action' => 'examById']);
$router->addPut('/api/exams/{examId}', ['action' => 'updateExam']);
$router->addPost('/api/exams', ['action' => 'createExam']);
$router->addGet('/api/persons', ['action' => 'persons']);

$router->handle($_SERVER['REQUEST_URI'] ?? '/');
$route = $router->getMatchedRoute();

if ($route === null) {
    http_response_code(404);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['message' => 'Route tidak ditemukan.'], JSON_THROW_ON_ERROR);
    exit;
}

$action = $router->getActionName() . 'Action';
$params = $router->getParams();

$controller = new ApiController($di);
$response = $controller->{$action}(...array_values($params));
$response->send();
