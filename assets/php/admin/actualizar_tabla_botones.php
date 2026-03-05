<?php
try {
    require_once("../conexion.php");
    
    // Check if columns exist before adding
    $stmt = $pdo->query("SHOW COLUMNS FROM slider_buttons");
    $columns = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    if (!in_array('position_top', $columns)) $pdo->exec("ALTER TABLE slider_buttons ADD COLUMN position_top VARCHAR(50) DEFAULT NULL");
    if (!in_array('position_left', $columns)) $pdo->exec("ALTER TABLE slider_buttons ADD COLUMN position_left VARCHAR(50) DEFAULT NULL");
    if (!in_array('position_right', $columns)) $pdo->exec("ALTER TABLE slider_buttons ADD COLUMN position_right VARCHAR(50) DEFAULT NULL");
    if (!in_array('position_bottom', $columns)) $pdo->exec("ALTER TABLE slider_buttons ADD COLUMN position_bottom VARCHAR(50) DEFAULT NULL");
    
    echo json_encode(['success' => true, 'message' => 'Columnas de posicionamiento añadidas exitosamente.']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
