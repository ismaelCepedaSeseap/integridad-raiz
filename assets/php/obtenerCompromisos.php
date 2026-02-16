<?php
    require_once __DIR__ . "/conexion.php";

    $stmt = $pdo->prepare("SELECT nombre, estado, compromiso, fecha from muro order by id desc");
    $stmt->execute();
    $compromisos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($compromisos, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
?>