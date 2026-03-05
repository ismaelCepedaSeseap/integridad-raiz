<?php
require_once("conexion.php");

try {
    echo "Iniciando actualización de base de datos...<br>";

    // Verificar si existe la columna position_top en slider_buttons
    $stmt = $pdo->prepare("SHOW COLUMNS FROM slider_buttons");
    $stmt->execute();
    $columns = $stmt->fetchAll(PDO::FETCH_COLUMN);

    $neededColumns = [
        'position_top' => "VARCHAR(50) DEFAULT NULL",
        'position_left' => "VARCHAR(50) DEFAULT NULL",
        'position_right' => "VARCHAR(50) DEFAULT NULL",
        'position_bottom' => "VARCHAR(50) DEFAULT NULL",
        'videoSrc' => "VARCHAR(255) DEFAULT NULL"
    ];

    foreach ($neededColumns as $col => $definition) {
        if (!in_array($col, $columns)) {
            echo "Agregando columna $col...<br>";
            $pdo->exec("ALTER TABLE slider_buttons ADD COLUMN $col $definition");
        } else {
            echo "La columna $col ya existe.<br>";
        }
    }

    echo "Base de datos actualizada correctamente.";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>