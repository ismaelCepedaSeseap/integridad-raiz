<?php
require_once("../conexion.php");
require_once("../security/auth.php");

header('Content-Type: application/json');

$autorizacion = new Auth();
$autorizado = $autorizacion->isLoggedIn();

if (!$autorizado) {
    http_response_code(401);
    echo json_encode(['error' => 'No autorizado']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit;
}

function slugify($text) {
    $text = trim((string)$text);
    if ($text === '') {
        return '';
    }
    $text = @iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $text) ?: $text;
    $text = strtolower($text);
    $text = preg_replace('/[^a-z0-9]+/', '-', $text);
    $text = trim($text, '-');
    return $text !== '' ? $text : 'item';
}

$id = isset($_POST['id']) ? intval($_POST['id']) : 0;
$estado_id = isset($_POST['estado_id']) ? intval($_POST['estado_id']) : 0;
$slogan = isset($_POST['slogan']) ? trim($_POST['slogan']) : '';

if ($estado_id === 0 || empty($slogan)) {
    http_response_code(400);
    echo json_encode(['error' => 'Estado y slogan son obligatorios']);
    exit;
}

try {
    $stmtEstado = $pdo->prepare("SELECT nombre FROM estados WHERE id = :id LIMIT 1");
    $stmtEstado->execute([':id' => $estado_id]);
    $estadoNombre = (string)($stmtEstado->fetchColumn() ?: '');
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'No se pudo resolver el estado']);
    exit;
}

if ($estadoNombre === '') {
    http_response_code(400);
    echo json_encode(['error' => 'Estado inválido']);
    exit;
}

$stateSlug = slugify($estadoNombre);
$guardianSlug = slugify($slogan);
$relativeDir = "assets/images/{$stateSlug}/videos/{$guardianSlug}";
$absoluteDir = __DIR__ . '/../../images/' . $stateSlug . '/videos/' . $guardianSlug . '/';
if (!is_dir($absoluteDir) && !mkdir($absoluteDir, 0777, true)) {
    http_response_code(500);
    echo json_encode(['error' => 'No se pudo crear el directorio de destino']);
    exit;
}

$video_src = '';
$poster_src = '';

// Procesar Video
if (isset($_FILES['video']) && $_FILES['video']['error'] === UPLOAD_ERR_OK) {
    $file = $_FILES['video'];
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if ($ext !== 'mp4') {
        echo json_encode(['error' => 'Solo se permiten videos MP4']);
        exit;
    }
    $filename = uniqid('video_', true) . '.' . $ext;
    if (move_uploaded_file($file['tmp_name'], $absoluteDir . $filename)) {
        $video_src = $relativeDir . '/' . $filename;
    } else {
        echo json_encode(['error' => 'Error al subir el video']);
        exit;
    }
}

// Procesar Poster
if (isset($_FILES['poster']) && $_FILES['poster']['error'] === UPLOAD_ERR_OK) {
    $file = $_FILES['poster'];
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $allowed_images = ['jpg', 'jpeg', 'png', 'webp'];
    if (!in_array($ext, $allowed_images)) {
        echo json_encode(['error' => 'Solo se permiten imágenes (JPG, PNG, WEBP)']);
        exit;
    }
    $filename = uniqid('poster_', true) . '.' . $ext;
    if (move_uploaded_file($file['tmp_name'], $absoluteDir . $filename)) {
        $poster_src = $relativeDir . '/' . $filename;
    } else {
        echo json_encode(['error' => 'Error al subir el poster']);
        exit;
    }
}

try {
    if ($id > 0) {
        // Actualizar
        $sql = "UPDATE guardianes SET estado_id = :estado_id, slogan = :slogan";
        $params = [':estado_id' => $estado_id, ':slogan' => $slogan, ':id' => $id];
        
        if ($video_src) {
            $sql .= ", video_src = :video_src";
            $params[':video_src'] = $video_src;
        }
        if ($poster_src) {
            $sql .= ", poster_src = :poster_src";
            $params[':poster_src'] = $poster_src;
        }
        
        $sql .= " WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        
        echo json_encode(['success' => true, 'message' => 'Guardián actualizado correctamente']);
    } else {
        // Insertar
        if (empty($video_src) || empty($poster_src)) {
            echo json_encode(['error' => 'Video y Poster son obligatorios para nuevos registros']);
            exit;
        }
        
        $stmt = $pdo->prepare("INSERT INTO guardianes (estado_id, slogan, video_src, poster_src, activo) VALUES (:estado_id, :slogan, :video_src, :poster_src, 1)");
        $stmt->execute([
            ':estado_id' => $estado_id,
            ':slogan' => $slogan,
            ':video_src' => $video_src,
            ':poster_src' => $poster_src
        ]);
        
        echo json_encode(['success' => true, 'message' => 'Guardián creado correctamente']);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error de base de datos: ' . $e->getMessage()]);
}
?>
