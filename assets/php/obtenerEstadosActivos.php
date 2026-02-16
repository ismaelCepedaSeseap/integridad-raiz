<?php
    require_once __DIR__ . "/conexion.php";

    // Consulta para obtener solo los estados activos (activo = 1)
    // Se ordena alfabéticamente por nombre
    $stmt = $pdo->prepare("SELECT id, nombre FROM estados WHERE activo = 1 ORDER BY nombre ASC");
    $stmt->execute();
    $estados = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Devolver respuesta en JSON
    echo json_encode($estados, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
?>