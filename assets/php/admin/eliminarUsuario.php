<?php
    // session_start();
    require_once __DIR__ . "/../conexion.php";
    require_once __DIR__ . "/../security/auth.php";
    header('Content-Type: application/json');

    $autorizacion = new auth();
    $autorizado = true; // $autorizacion->isLoggedIn();

    if($autorizado){
        $data = json_decode(file_get_contents('php://input'), true);
        if ($data && isset($data['id'])) {
            try {
                $stmt = $pdo->prepare("DELETE FROM usuarios WHERE id = ?");
                if ($stmt->execute([$data['id']])) {
                    echo json_encode(['status' => 'success']);
                } else {
                    http_response_code(500);
                    echo json_encode(['status' => 'error', 'message' => 'Error al eliminar']);
                }
            } catch (PDOException $e) {
                 http_response_code(500);
                 echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
            }
        } else {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'ID requerido']);
        }
    } else {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'No autorizado']);
    }
?>