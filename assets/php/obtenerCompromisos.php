<?php
    require_once __DIR__ . "/conexion.php";

    $stmt = $pdo->prepare("SELECT nombre, estado, compromiso, fecha from muro order by id desc");
    $stmt->execute();
    $compromisos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // FALLBACK DEMO DATA: Si no hay compromisos en la BD, devolvemos datos de prueba para el video
    if (empty($compromisos)) {
        $compromisos = [
            ["nombre" => "Sofía Martínez", "estado" => "Puebla", "compromiso" => "Prometo decir siempre la verdad, aunque sea difícil.", "fecha" => date("Y-m-d")],
            ["nombre" => "Mateo López", "estado" => "Hidalgo", "compromiso" => "Cuidaré el mobiliario de mi escuela y respetaré a mis maestros.", "fecha" => date("Y-m-d")],
            ["nombre" => "Valentina Ramírez", "estado" => "Tlaxcala", "compromiso" => "No haré trampa en los juegos ni en los exámenes.", "fecha" => date("Y-m-d")],
            ["nombre" => "Diego Torres", "estado" => "Puebla", "compromiso" => "Ayudaré a mis compañeros cuando no entiendan algo.", "fecha" => date("Y-m-d")],
            ["nombre" => "Camila Hernández", "estado" => "Hidalgo", "compromiso" => "Respetaré las reglas de tránsito cuando ande en bici.", "fecha" => date("Y-m-d")]
        ];
    }

    echo json_encode($compromisos, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
?>