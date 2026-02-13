<?php
    // session_start();
    require_once("../conexion.php");
    require_once("../security/auth.php");
    header('Content-Type: application/json');

    $autorizacion = new auth();
    $autorizado = true; // $autorizacion->isLoggedIn();

    if($autorizado){
        $data = json_decode(file_get_contents('php://input'), true);
        if ($data && isset($data['id'])) {
            try {
                // Por ahora solo actualizamos el nombre como ejemplo, pero se puede extender
                $nombre = $data['nombre'];
                
                $stmt = $pdo->prepare("UPDATE usuarios SET nombre = ? WHERE id = ?");
                
                if ($stmt->execute([$nombre, $data['id']])) {
                    echo json_encode(['status' => 'success']);
                } else {
                    http_response_code(500);
                    echo json_encode(['status' => 'error', 'message' => 'Error al actualizar']);
                }
            } catch (PDOException $e) {
                 http_response_code(500);
                 echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
            }
        } else {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Datos inválidos']);
        }
    } else {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'No autorizado']);
    }
?>