<?php
    session_start();
    require_once __DIR__ . "/../conexion.php";
    require_once __DIR__ . "/../security/auth.php";

    $email = $_POST["email"];
    $password = $_POST["password"];
    $autorizacion = new auth($pdo);
    $autorizado = $autorizacion->login($email, $password);
    echo json_encode([
        "success"=>$autorizado
    ]);
?>