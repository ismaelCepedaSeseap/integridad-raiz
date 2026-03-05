<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');

require_once __DIR__ . '/../assets/php/conexion.php';

try {
    $incluirInactivos = isset($_GET['incluir_inactivos']) && $_GET['incluir_inactivos'] === '1';
    
    // Consulta usando nombres de columnas en español
    $sql = "SELECT id, tema, consejo, activo, orden FROM frutos_arbol";
    
    if (!$incluirInactivos) {
        $sql .= " WHERE activo = 1";
    }
    
    $sql .= " ORDER BY orden ASC, id ASC";

    $stmt = $pdo->query($sql);
    $filas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Mapeamos a claves JSON en español
    $datos = array_map(function ($fila) {
        return [
            'id' => (int)$fila['id'],
            'tema' => $fila['tema'],
            'consejo' => $fila['consejo'],
            'activo' => (int)$fila['activo'],
            'orden' => (int)$fila['orden']
        ];
    }, $filas);

    echo json_encode([
        'exito' => true,
        'datos' => $datos
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'exito' => false,
        'error' => 'No se pudieron cargar los frutos del árbol.'
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}
