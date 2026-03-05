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
    $stmt = $pdo->prepare("SELECT * FROM sliders ORDER BY orden ASC");
    $stmt->execute();
    $sliders = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $stmtButtons = $pdo->prepare("SELECT * FROM slider_buttons WHERE slider_id = ?");

    foreach ($sliders as &$slider) {
        $stmtButtons->execute([$slider['id']]);
        $slider['buttons'] = $stmtButtons->fetchAll(PDO::FETCH_ASSOC);
    }

    echo json_encode($sliders);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error de base de datos: ' . $e->getMessage()]);
}
?>