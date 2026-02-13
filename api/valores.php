<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../config/db.php';
$sql = "CREATE TABLE IF NOT EXISTS valores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(64) UNIQUE NOT NULL,
    nombre VARCHAR(128) NOT NULL,
    descripcion VARCHAR(512) NOT NULL,
    icono VARCHAR(64) NOT NULL
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci";
$pdo->exec($sql);
$stmt = $pdo->query("SELECT slug, nombre, descripcion, icono FROM valores ORDER BY id ASC");
$rows = $stmt->fetchAll();
echo json_encode($rows);
