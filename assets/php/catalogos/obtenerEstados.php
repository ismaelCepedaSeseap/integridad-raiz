<?php
    session_start();
    require_once("../conexion.php");
    require_once("../security/auth.php");

    $autorizacion = new auth();
    // $autorizado = $autorizacion->isLoggedIn();
    $autorizado = true;
    if($autorizado){
        $stmt = $pdo->prepare("SELECT id, nombre from estados where activo = 1");
        $stmt->execute();
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($users, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    }
?>