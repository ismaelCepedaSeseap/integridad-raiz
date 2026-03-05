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

try {
    $stmt = $pdo->query("SELECT id, tema, consejo, activo, orden FROM frutos_arbol ORDER BY orden ASC, id ASC");
    $filas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Mapeo directo a JSON con claves en español
    $datos = array_map(function ($fila) {
        return [
            'id' => (int)$fila['id'],
            'tema' => $fila['tema'],
            'consejo' => $fila['consejo'],
            'activo' => (int)$fila['activo'],
            'orden' => (int)$fila['orden']
        ];
    }, $filas);

    echo json_encode(['exito' => true, 'datos' => $datos], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['exito' => false, 'error' => 'Error al cargar los frutos.']);
}
