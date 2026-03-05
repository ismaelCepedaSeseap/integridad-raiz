<?php
require_once("../conexion.php");
require_once("../security/auth.php");

header('Content-Type: application/json; charset=utf-8');

$auth = new Auth();
if (!$auth->isLoggedIn()) {
    http_response_code(401);
    echo json_encode(['exito' => false, 'error' => 'No autorizado']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['exito' => false, 'error' => 'Método no permitido']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$id = isset($input['id']) ? (int)$input['id'] : 0;

if ($id <= 0) {
    http_response_code(400);
    echo json_encode(['exito' => false, 'error' => 'ID inválido']);
    exit;
}

try {
    $stmt = $pdo->prepare("DELETE FROM frutos_arbol WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(['exito' => true], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['exito' => false, 'error' => 'No se pudo eliminar el fruto']);
}
