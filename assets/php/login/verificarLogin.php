<?php
    header('Content-Type: application/json');
    require_once("../conexion.php");
    require_once("../security/auth.php");

    try {
        $email = $_POST["email"] ?? '';
        $password = $_POST["password"] ?? '';

        if (empty($email) || empty($password)) {
            echo json_encode([
                "success" => false,
                "error" => "Email y contraseña son requeridos"
            ]);
            exit;
        }

        $autorizacion = new Auth($pdo);
        $autorizado = $autorizacion->login($email, $password);
        
        echo json_encode([
            "success" => $autorizado
        ]);
    } catch (Exception $e) {
        echo json_encode([
            "success" => false,
            "error" => "Error interno: " . $e->getMessage()
        ]);
    }
?>