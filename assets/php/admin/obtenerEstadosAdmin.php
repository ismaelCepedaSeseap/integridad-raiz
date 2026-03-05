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
    // Obtener todos los estados
    $stmt = $pdo->prepare("SELECT * FROM estados ORDER BY nombre ASC");
    $stmt->execute();
    $estados = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Obtener redes sociales para cada estado
    $stmtRedes = $pdo->prepare("
        SELECT r.red_social_id, c.clave, c.nombre, r.url 
        FROM estado_redes_sociales r
        JOIN redes_sociales c ON r.red_social_id = c.id
        WHERE r.estado_id = ?
    ");

    foreach ($estados as &$estado) {
        if (isset($estado['activo'])) {
            if (is_string($estado['activo']) && strlen($estado['activo']) === 1) {
                $estado['activo'] = ord($estado['activo']) === 1 ? 1 : 0;
            } else {
                $estado['activo'] = (int)$estado['activo'] ? 1 : 0;
            }
        } else {
            $estado['activo'] = 0;
        }
        $stmtRedes->execute([$estado['id']]);
        $estado['redes_sociales'] = $stmtRedes->fetchAll(PDO::FETCH_ASSOC);
    }

    echo json_encode($estados);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error de base de datos: ' . $e->getMessage()]);
}
?>
