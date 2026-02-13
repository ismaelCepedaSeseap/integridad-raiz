<?php
    // session_start();
    require_once("../conexion.php");
    require_once("../security/auth.php");

    $autorizacion = new auth();
    // $autorizado = $autorizacion->isLoggedIn();
    $autorizado = true;
    if($autorizado){
        $stmt = $pdo->prepare("SELECT us.id usuarioId, concat(us.nombre, ' ', us.primerApellido, ' ',  us.segundoApellido) as nombre, us.correo correo, us.activo usuarioActivo, rl.id rolId, rl.nombre rolNombre, rl.activo rolActivo, es.id estadoId, es.nombre estadoNombre FROM usuarios us inner join roles rl on us.rol = rl.id inner JOIN estados es ON us.estado = es.id");
        $stmt->execute();
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($users, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    }
?>