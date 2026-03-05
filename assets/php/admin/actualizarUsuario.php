<?php
    require_once __DIR__ . "/../conexion.php";
    require_once __DIR__ . "/../security/auth.php";
    header('Content-Type: application/json');

    $autorizacion = new Auth();
    $autorizado = $autorizacion->isLoggedIn();

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
                // Ensure activo is strictly 0 or 1
                $activoRaw = $data['activo'] ?? 0;
                if ($activoRaw === 'true' || $activoRaw === true || $activoRaw === 1 || $activoRaw === '1') {
                    $activo = 1;
                } else {
                    $activo = 0;
                }
                
                // If password is provided and not empty, update it
                $passwordUpdate = "";
                $params = []; // Unused with bindParam
                
                if (!empty($data['password'])) {
                    $passwordUpdate = ", pass = ?";
                }
                
                $sql = "UPDATE usuarios SET nombre = ?, primerApellido = ?, segundoApellido = ?, correo = ?, rol = ?, estado = ?, activo = ? $passwordUpdate WHERE id = ?";
                $stmt = $pdo->prepare($sql);
                
                $stmt->bindParam(1, $nombre);
                $stmt->bindParam(2, $primerApellido);
                $stmt->bindParam(3, $segundoApellido);
                $stmt->bindParam(4, $correo);
                $stmt->bindParam(5, $rol);
                $stmt->bindParam(6, $estado);
                $stmt->bindValue(7, (int)$activo, PDO::PARAM_INT); // Force integer

                $paramIndex = 8;
                if (!empty($data['password'])) {
                    $passHash = password_hash($data['password'], PASSWORD_DEFAULT);
                    $stmt->bindParam($paramIndex, $passHash);
                    $paramIndex++;
                }

                $stmt->bindParam($paramIndex, $id);
                
                if ($stmt->execute()) {
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
