<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../config/db.php';
try {
  $pdo->exec("CREATE TABLE IF NOT EXISTS slides (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    subtitulo VARCHAR(128) DEFAULT NULL,
    descripcion VARCHAR(512) DEFAULT NULL,
    cta_text VARCHAR(64) DEFAULT NULL,
    cta_url VARCHAR(512) DEFAULT NULL,
    imagen VARCHAR(255) DEFAULT NULL,
    diseno TINYINT NOT NULL,
    activo TINYINT DEFAULT 1,
    orden INT DEFAULT 0
  ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
  $stmt = $pdo->query("SELECT id, titulo, subtitulo, descripcion, cta_text, cta_url, imagen, diseno, activo, orden FROM slides ORDER BY orden ASC, id ASC");
  $rows = $stmt->fetchAll();
  echo json_encode(['count' => count($rows), 'slides' => $rows], JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['error' => 'query_failed']);
}
