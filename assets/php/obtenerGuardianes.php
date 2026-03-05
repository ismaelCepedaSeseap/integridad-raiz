<?php
require_once __DIR__ . '/../../config/db.php';

header('Content-Type: application/json');

try {
    // Consulta: Obtener guardianes activos y sus datos de estado relacionados
    $stmt = $pdo->prepare("
        SELECT 
            g.id,
            g.slogan,
            g.video_src,
            g.poster_src,
            e.nombre as estado_nombre,
            e.id as estado_id
        FROM guardianes g
        JOIN estados e ON g.estado_id = e.id
        WHERE g.activo = 1 AND e.activo = 1
    ");
    $stmt->execute();
    $guardianes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $cineData = [];

    foreach ($guardianes as $guardian) {
        // Determinar titleColorClass basado en el estado (lógica simple por ahora, se puede mejorar)
        // Ejemplo: Puebla verde, otros slate
        $titleColorClass = 'text-slate-900';
        if (stripos($guardian['estado_nombre'], 'Puebla') !== false) {
            $titleColorClass = 'text-green-900';
        }

        $cineData[] = [
            'id' => strtolower(str_replace(' ', '-', $guardian['estado_nombre'])), // id generado del nombre
            'name' => strtoupper($guardian['estado_nombre']),
            'slogan' => $guardian['slogan'],
            'videoSrc' => $guardian['video_src'],
            'posterSrc' => $guardian['poster_src'],
            'url' => 'cine.html?estado=' . strtolower(str_replace(' ', '-', $guardian['estado_nombre'])),
            'titleColorClass' => $titleColorClass
        ];
    }

    echo json_encode($cineData);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error de base de datos: ' . $e->getMessage()]);
}
