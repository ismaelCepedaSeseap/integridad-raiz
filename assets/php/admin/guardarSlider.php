<?php
require_once("../conexion.php");
require_once("../security/auth.php");

header('Content-Type: application/json');

$autorizacion = new Auth();
if (!$autorizacion->isLoggedIn()) {
    http_response_code(401);
    echo json_encode(['error' => 'No autorizado']);
    exit;
}

try {
    $id = $_POST['id'] ?? null;
    $type = $_POST['type'] ?? 'simple'; // Por defecto simple
    $orden = $_POST['orden'] ?? 0;

    // Forzar tipo complex solo si es el primero (orden 0)
    if ($orden == 0) {
        $type = 'complex';
    } else {
        $type = 'simple';
    }

    $background = $_POST['background'] ?? null;
    $badge = $_POST['badge'] ?? null;
    $title = $_POST['title'] ?? null;
    $description = $_POST['description'] ?? null;
    $activo = $_POST['activo'] ?? 1;
    
    $imagePath = $_POST['url_image_actual'] ?? null;
    $backgroundImagePath = $_POST['url_backgroundImage_actual'] ?? null;

    // Manejo de carga de archivos (Image)
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = '../../images/uploads/sliders/';
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);
        
        $fileName = time() . '_' . basename($_FILES['image']['name']);
        $targetPath = $uploadDir . $fileName;
        
        if (move_uploaded_file($_FILES['image']['tmp_name'], $targetPath)) {
            $imagePath = 'assets/images/uploads/sliders/' . $fileName;
        }
    }

    // Manejo de carga de archivos (BackgroundImage)
    if (isset($_FILES['backgroundImage']) && $_FILES['backgroundImage']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = '../../images/uploads/sliders/';
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);
        
        $fileName = 'bg_' . time() . '_' . basename($_FILES['backgroundImage']['name']);
        $targetPath = $uploadDir . $fileName;
        
        if (move_uploaded_file($_FILES['backgroundImage']['tmp_name'], $targetPath)) {
            $backgroundImagePath = 'assets/images/uploads/sliders/' . $fileName;
        }
    }

    $pdo->beginTransaction();

    if ($id) {
        // Actualizar
        $stmt = $pdo->prepare("UPDATE sliders SET type = ?, background = ?, backgroundImage = ?, badge = ?, title = ?, description = ?, image = ?, activo = ?, orden = ? WHERE id = ?");
        $stmt->execute([$type, $background, $backgroundImagePath, $badge, $title, $description, $imagePath, $activo, $orden, $id]);
        $sliderId = $id;
    } else {
        // Insertar
        $stmt = $pdo->prepare("INSERT INTO sliders (type, background, backgroundImage, badge, title, description, image, activo, orden) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$type, $background, $backgroundImagePath, $badge, $title, $description, $imagePath, $activo, $orden]);
        $sliderId = $pdo->lastInsertId();
    }

    // Manejar Botones
    $buttons = json_decode($_POST['buttons'] ?? '[]', true);
    
    // Eliminar botones viejos
    $stmtDel = $pdo->prepare("DELETE FROM slider_buttons WHERE slider_id = ?");
    $stmtDel->execute([$sliderId]);

    // Insertar botones nuevos
    $stmtBtn = $pdo->prepare("INSERT INTO slider_buttons (slider_id, text, url, icon, style, videoSrc, position_top, position_left, position_right, position_bottom) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    foreach ($buttons as $btn) {
        $stmtBtn->execute([
            $sliderId,
            $btn['text'],
            $btn['url'],
            $btn['icon'] ?? 'play-circle',
            $btn['style'] ?? 'primary',
            $btn['videoSrc'] ?? null,
            $btn['position_top'] ?? null,
            $btn['position_left'] ?? null,
            $btn['position_right'] ?? null,
            $btn['position_bottom'] ?? null
        ]);
    }

    $pdo->commit();
    echo json_encode(['success' => true, 'id' => $sliderId]);

} catch (Exception $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>