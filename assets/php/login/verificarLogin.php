<?php
    session_start();
    require_once("../conexion.php");
    require_once("../security/auth.php");

    $email = $_POST["email"];
    $password = $_POST["password"];
    $autorizacion = new auth($pdo);
    $autorizado = $autorizacion->login($email, $password);
    echo json_encode([
        "success"=>$autorizado
    ]);
?>