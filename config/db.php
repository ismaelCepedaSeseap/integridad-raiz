<?php
header('Access-Control-Allow-Origin: *');

// Load environment config if exists
$env = [];
if (file_exists(__DIR__ . '/env.php')) {
    $env = require __DIR__ . '/env.php';
}

if (!function_exists('getenv')) {}
$host = getenv('DB_HOST') ?: ($env['DB_HOST'] ?? 'localhost');
$db   = getenv('DB_NAME') ?: ($env['DB_NAME'] ?? 'integridadraiz');
$user = getenv('DB_USER') ?: ($env['DB_USER'] ?? 'root');
$pass = getenv('DB_PASS') ?: ($env['DB_PASS'] ?? null);
$charset = 'utf8mb4';
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];
try {
    $serverDsn = "mysql:host=$host;charset=$charset";
    $serverPdo = new PDO($serverDsn, $user, $pass, $options);
    $serverPdo->exec("CREATE DATABASE IF NOT EXISTS `$db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    $dsn = "mysql:host=$host;dbname=$db;charset=$charset";
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    throw new \PDOException($e->getMessage(), (int)$e->getCode());
}
