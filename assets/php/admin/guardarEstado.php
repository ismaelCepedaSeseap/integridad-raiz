<?php
// Habilitar errores para depuración temporalmente
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

try {
    require_once("../conexion.php");
    require_once("../security/auth.php");

    header('Content-Type: application/json');

    // DEBUG: Comentar en producción - permite ver qué recibe el PHP
    /*
    error_log("POST: " . print_r($_POST, true));
    error_log("FILES: " . print_r($_FILES, true));
    */

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

    // Ahora usamos $_POST porque estamos enviando un FormData
    $id = isset($_POST['id']) ? intval($_POST['id']) : 0;
    $nombre = $_POST['nombre'] ?? '';
    $url_sitio = $_POST['url_sitio'] ?? '';
    $url_logo_actual = $_POST['url_logo_actual'] ?? '';
    
    // Aseguramos que activo sea solo 0 o 1 (el error 1406 sugiere que la columna es tinyint(1) o similar)
    $activo_raw = $_POST['activo'] ?? '1';
    $activo = ($activo_raw === '1' || $activo_raw === 1) ? 1 : 0;

    $redes_json = $_POST['redes_sociales'] ?? '[]';
    $redes = json_decode($redes_json, true);

    // Validación básica
    if (empty($nombre)) {
        http_response_code(400);
        echo json_encode(['error' => 'El nombre es requerido']);
        exit;
    }

    // Procesar la imagen si se subió una nueva
    $url_logo = $url_logo_actual; // Por defecto mantenemos la actual

    if (isset($_FILES['logo']) && $_FILES['logo']['error'] === UPLOAD_ERR_OK) {
        $fileTmpPath = $_FILES['logo']['tmp_name'];
        $fileName = $_FILES['logo']['name'];
        $fileSize = $_FILES['logo']['size'];
        $fileType = $_FILES['logo']['type'];
        $fileNameCmps = explode(".", $fileName);
        $fileExtension = strtolower(end($fileNameCmps));

        // Limpiar nombre de archivo
        $newFileName = md5(time() . $fileName) . '.' . $fileExtension;

        // Directorio de subida
        $uploadFileDir = '../../images/logos/';
        
        // Crear directorio si no existe
        if (!is_dir($uploadFileDir)) {
            if (!mkdir($uploadFileDir, 0777, true)) {
                throw new Exception("No se pudo crear el directorio: $uploadFileDir");
            }
        }

        $dest_path = $uploadFileDir . $newFileName;

        if (move_uploaded_file($fileTmpPath, $dest_path)) {
            $url_logo = 'assets/images/logos/' . $newFileName;
            
            // Opcional: Eliminar el logo anterior si existía y no es el default
            if (!empty($url_logo_actual) && $url_logo_actual !== 'assets/images/logo.png') {
                $old_file = '../../' . str_replace('assets/images/', 'images/', $url_logo_actual);
                if (file_exists($old_file)) {
                    @unlink($old_file);
                }
            }
        } else {
            throw new Exception('Error al mover el archivo al directorio de subidas.');
        }
    }

    $pdo->beginTransaction();

    if ($id > 0) {
        // Actualizar
        // Para columnas BIT, usamos b'0' o b'1' en la consulta directa
        $stmt = $pdo->prepare("UPDATE estados SET nombre = ?, url_sitio = ?, url_logo = ?, activo = CAST(? AS UNSIGNED) WHERE id = ?");
        $stmt->execute([$nombre, $url_sitio, $url_logo, $activo, $id]);
    } else {
        // Insertar
        $stmt = $pdo->prepare("INSERT INTO estados (nombre, url_sitio, url_logo, activo) VALUES (?, ?, ?, CAST(? AS UNSIGNED))");
        $stmt->execute([$nombre, $url_sitio, $url_logo, $activo]);
        $id = $pdo->lastInsertId();
    }

    // Actualizar redes sociales
    $stmt = $pdo->prepare("DELETE FROM estado_redes_sociales WHERE estado_id = ?");
    $stmt->execute([$id]);

    if (!empty($redes)) {
        $stmt = $pdo->prepare("INSERT INTO estado_redes_sociales (estado_id, red_social_id, url) VALUES (?, ?, ?)");
        foreach ($redes as $red) {
            if (!empty($red['red_social_id']) && !empty($red['url'])) {
                $stmt->execute([$id, $red['red_social_id'], $red['url']]);
            }
        }
    }

    $pdo->commit();
    echo json_encode(['success' => true, 'id' => $id]);

} catch (Exception $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>