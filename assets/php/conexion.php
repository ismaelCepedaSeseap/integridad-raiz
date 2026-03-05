<?php

// Intentar cargar configuración desde env.php
$envPath = __DIR__ . '/../../config/env.php';
$config = [];
if (file_exists($envPath)) {
    $config = require $envPath;
}

$host = $config['DB_HOST'] ?? 'localhost';
$db   = $config['DB_NAME'] ?? 'integridadraiz';
$user = $config['DB_USER'] ?? 'root';
$pass = $config['DB_PASS'] ?? '12345';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
     $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
     // En producción, es mejor no mostrar el mensaje de error directamente al cliente
     // Pero para depuración del error 500, esto ayudará a ver qué pasa
     header('Content-Type: application/json');
     echo json_encode([
         'success' => false,
         'error' => 'Error de conexión a la base de datos: ' . $e->getMessage()
     ]);
     exit;
}