<?php
require_once("conexion.php");

header('Content-Type: application/json');

try {
    // Solo obtenemos sliders activos y ordenados
    $stmt = $pdo->prepare("SELECT * FROM sliders WHERE activo = 1 ORDER BY orden ASC");
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
    echo json_encode(['error' => 'Error de base de datos']);
}
?>