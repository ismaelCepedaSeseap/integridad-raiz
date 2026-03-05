<?php
    require_once __DIR__ . "/../conexion.php";
    require_once __DIR__ . "/../security/auth.php";
    header('Content-Type: application/json');

    $autorizacion = new Auth();
    $autorizado = $autorizacion->isLoggedIn();

    if($autorizado){
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Basic validation
        if ($data && isset($data['nombre']) && isset($data['apellido1']) && isset($data['email']) && isset($data['rol']) && isset($data['estado'])) {
            try {
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
                
                // Default password for new users (can be changed later or sent in request)
                $password = password_hash('12345678', PASSWORD_DEFAULT); 
                
                if (isset($data['password']) && !empty($data['password'])) {
                    $password = password_hash($data['password'], PASSWORD_DEFAULT);
                }

                $sql = "INSERT INTO usuarios (nombre, primerApellido, segundoApellido, correo, rol, estado, activo, pass) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
                $stmt = $pdo->prepare($sql);
                
                if ($stmt->execute([$nombre, $primerApellido, $segundoApellido, $correo, $rol, $estado, $activo, $password])) {
                    $id = $pdo->lastInsertId();
                    echo json_encode(['status' => 'success', 'id' => $id]);
                } else {
                    http_response_code(500);
                    echo json_encode(['status' => 'error', 'message' => 'Error al registrar']);
                }
            } catch (PDOException $e) {
                 http_response_code(500);
                 echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
            }
        } else {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Datos incompletos']);
        }
    } else {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'No autorizado']);
    }
?>