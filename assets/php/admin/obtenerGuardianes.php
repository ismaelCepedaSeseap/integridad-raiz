<?php
    require_once("../conexion.php");
    require_once("../security/auth.php");

    header('Content-Type: application/json');

    $autorizacion = new Auth();
    $autorizado = $autorizacion->isLoggedIn();
    if($autorizado){
        $stmt = $pdo->prepare("SELECT g.id, g.estado_id, e.nombre as estado_nombre, g.slogan, g.video_src, g.poster_src, g.activo FROM guardianes g JOIN estados e ON g.estado_id = e.id WHERE g.activo = 1 ORDER BY g.id DESC");
        $stmt->execute();
        $guardianes = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($guardianes, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'No autorizado']);
    }
?>