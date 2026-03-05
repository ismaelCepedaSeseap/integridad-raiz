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
$tema = trim($input['tema'] ?? '');
$consejo = trim($input['consejo'] ?? '');
$activo = isset($input['activo']) && (int)$input['activo'] === 0 ? 0 : 1;
$orden = isset($input['orden']) ? (int)$input['orden'] : 0;

if ($tema === '' || $consejo === '') {
    http_response_code(400);
    echo json_encode(['exito' => false, 'error' => 'Tema y consejo son obligatorios']);
    exit;
}

try {
    if ($id > 0) {
        $stmt = $pdo->prepare("UPDATE frutos_arbol SET tema = ?, consejo = ?, activo = ?, orden = ? WHERE id = ?");
        $stmt->execute([$tema, $consejo, $activo, $orden, $id]);
    } else {
        if ($orden <= 0) {
            $maxStmt = $pdo->query("SELECT COALESCE(MAX(orden), 0) AS max_order FROM frutos_arbol");
            $maxOrder = (int)$maxStmt->fetchColumn();
            $orden = $maxOrder + 1;
        }
        $stmt = $pdo->prepare("INSERT INTO frutos_arbol (tema, consejo, activo, orden) VALUES (?, ?, ?, ?)");
        $stmt->execute([$tema, $consejo, $activo, $orden]);
        $id = (int)$pdo->lastInsertId();
    }

    echo json_encode(['exito' => true, 'id' => $id], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['exito' => false, 'error' => 'No se pudo guardar el fruto']);
}
