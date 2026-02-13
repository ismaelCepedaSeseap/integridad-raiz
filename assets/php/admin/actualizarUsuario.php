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
                $id = $data['id'];
                $nombre = $data['nombre'];
                $primerApellido = $data['apellido1'];
                $segundoApellido = $data['apellido2'] ?? '';
                $correo = $data['email'];
                $rol = $data['rol'];
                $estado = $data['estado'];
                $activo = isset($data['activo']) && $data['activo'] ? 1 : 0;
                
                // If password is provided and not empty, update it
                $passwordUpdate = "";
                $params = [$nombre, $primerApellido, $segundoApellido, $correo, $rol, $estado, $activo];
                
                if (!empty($data['password'])) {
                    $passwordUpdate = ", pass = ?";
                    $params[] = password_hash($data['password'], PASSWORD_DEFAULT);
                }
                
                $params[] = $id;

                $sql = "UPDATE usuarios SET nombre = ?, primerApellido = ?, segundoApellido = ?, correo = ?, rol = ?, estado = ?, activo = ? $passwordUpdate WHERE id = ?";
                $stmt = $pdo->prepare($sql);
                
                if ($stmt->execute($params)) {
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
