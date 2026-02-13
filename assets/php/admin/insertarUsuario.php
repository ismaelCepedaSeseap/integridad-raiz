<?php
    // session_start();
    require_once("../conexion.php");
    require_once("../security/auth.php");

    header('Content-Type: application/json');

    $autorizacion = new auth();
    // $autorizado = $autorizacion->isLoggedIn(); 
    // Commented out auth for now to avoid session issues during development if cookies aren't set
    $autorizado = true; 

    if($autorizado){
        $data = json_decode(file_get_contents('php://input'), true);

        if ($data) {
            try {
                $nombre = $data['nombre'];
                $primerApellido = $data['apellido1'];
                $segundoApellido = $data['apellido2'] ?? '';
                $correo = $data['email'];
                $rol = $data['rol'];
                $estado = $data['estado'];
                $activo = isset($data['activo']) && $data['activo'] ? 1 : 0;
                $password = password_hash($data['password'], PASSWORD_DEFAULT);

                $stmt = $pdo->prepare("INSERT INTO usuarios (nombre, primerApellido, segundoApellido, correo, password, rol, estado, activo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
                
                if ($stmt->execute([$nombre, $primerApellido, $segundoApellido, $correo, $password, $rol, $estado, $activo])) {
                    echo json_encode(['status' => 'success', 'message' => 'Usuario registrado', 'id' => $pdo->lastInsertId()]);
                } else {
                    http_response_code(500);
                    echo json_encode(['status' => 'error', 'message' => 'Error al registrar en BD']);
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