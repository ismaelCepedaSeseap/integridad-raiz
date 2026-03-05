<?php
require_once("../conexion.php");
require_once("../security/auth.php");

header('Content-Type: application/json');

$autorizacion = new Auth();
$autorizado = $autorizacion->isLoggedIn();

if (!$autorizado) {
    http_response_code(401);
    echo json_encode(['error' => 'No autorizado']);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT * FROM redes_sociales ORDER BY nombre ASC");
    $stmt->execute();
    $redes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($redes);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error de base de datos: ' . $e->getMessage()]);
}
?>