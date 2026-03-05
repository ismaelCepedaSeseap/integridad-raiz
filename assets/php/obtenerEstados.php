<?php
require_once __DIR__ . '/../../config/db.php';

header('Content-Type: application/json');

try {
    // Definimos la región manualmente ya que es estática
    $regionData = [
        'id' => 'region-golfo-istmo',
        'name' => 'Región Centro Golfo Istmo',
        'mainImage' => 'assets/images/golfoitsmo.png',
        'states' => []
    ];

    // Consulta: Obtener estados activos
    // Incluye url_sitio y url_logo directamente de la tabla estados (agregados recientemente)
    $stmtEstados = $pdo->prepare("SELECT id, nombre, url_sitio, url_logo FROM estados WHERE activo = 1 ORDER BY nombre ASC");
    $stmtEstados->execute();
    $estados = $stmtEstados->fetchAll(PDO::FETCH_ASSOC);

    // Si no hay estados en la DB, lanzamos una excepción para que use el fallback
    if (empty($estados)) {
        throw new Exception("No hay estados activos en la base de datos.");
    }

    // Preparamos consulta para obtener redes sociales de cada estado
    // JOIN entre estado_redes_sociales y redes_sociales para obtener la clave (facebook, twitter, etc)
    $stmtRedes = $pdo->prepare("
        SELECT c.clave, r.url 
        FROM estado_redes_sociales r
        JOIN redes_sociales c ON r.red_social_id = c.id
        WHERE r.estado_id = ?
    ");

    foreach ($estados as $estado) {
        // Obtener redes sociales para este estado
        $stmtRedes->execute([$estado['id']]);
        $redes = $stmtRedes->fetchAll(PDO::FETCH_ASSOC);

        $social = [];
        foreach ($redes as $red) {
            $social[$red['clave']] = $red['url'];
        }

        $regionData['states'][] = [
            'id' => $estado['id'],
            'name' => $estado['nombre'],
            'url' => $estado['url_sitio'],
            'logo' => $estado['url_logo'],
            'social' => (object)$social // Cast to object for JSON {}
        ];
    }

    // Devolvemos un array con el único objeto de región, para mantener la estructura original [ { ... } ]
    echo json_encode([$regionData]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error: ' . $e->getMessage()]);
}
