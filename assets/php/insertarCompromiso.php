<?php
    require_once __DIR__ . "/conexion.php";


    function insertarMuro($nombre, $estado, $compromiso, $pdo){
        $fecha = date("Y-m-d H:i:s");
        $stmt = $pdo->prepare("INSERT into muro (nombre, estado, compromiso, fecha) VALUES (?, ?, ?, ?)");
        $stmt->execute([$nombre, $estado, $compromiso, $fecha]);
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    }
    
?>