<?php
require_once("../conexion.php");
require_once("../security/auth.php");

header('Content-Type: application/json');

$autorizacion = new Auth();
if (!$autorizacion->isLoggedIn()) {
    http_response_code(401);
    echo json_encode(['error' => 'No autorizado']);
    exit;
}

try {
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'] ?? null;

    if (!$id) {
        echo json_encode(['success' => false, 'error' => 'ID no proporcionado']);
        exit;
    }

    $stmt = $pdo->prepare("DELETE FROM sliders WHERE id = ?");
    $stmt->execute([$id]);

    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>