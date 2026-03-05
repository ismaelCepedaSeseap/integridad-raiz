<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

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

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

if (!isset($_FILES['image'])) {
    http_response_code(400);
    echo json_encode(['error' => 'No image uploaded']);
    exit;
}

$file = $_FILES['image'];
$originalName = basename($file['name']);
$imageFileType = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));

// Allow certain file formats
$allowed_images = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
$allowed_videos = ['mp4'];

if (!in_array($imageFileType, $allowed_images) && !in_array($imageFileType, $allowed_videos)) {
    echo json_encode(['error' => 'Sorry, only JPG, JPEG, PNG, GIF, WEBP & MP4 files are allowed.']);
    exit;
}

// Check if image file is a actual image or fake image (only for images)
if (in_array($imageFileType, $allowed_images)) {
    $check = getimagesize($file['tmp_name']);
    if ($check === false) {
        echo json_encode(['error' => 'File is not an image.']);
        exit;
    }
}

if (!is_uploaded_file($file['tmp_name'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid upload']);
    exit;
}

$stateSlug = slugify($_POST['state'] ?? '');
$sectionSlug = slugify($_POST['section'] ?? '');
$entitySlug = slugify($_POST['entity_name'] ?? '');

$relativeDir = 'assets/images/uploads';
if ($stateSlug !== '' && $sectionSlug !== '' && $entitySlug !== '') {
    $relativeDir = "assets/images/{$stateSlug}/{$sectionSlug}/{$entitySlug}";
}

$targetDir = "../{$relativeDir}/";
if (!is_dir($targetDir) && !mkdir($targetDir, 0777, true)) {
    http_response_code(500);
    echo json_encode(['error' => 'Could not create destination folder']);
    exit;
}

$filename = uniqid('', true) . '.' . $imageFileType;
$target_file = $targetDir . $filename;

if (move_uploaded_file($file['tmp_name'], $target_file)) {
    echo json_encode(['success' => true, 'path' => $relativeDir . '/' . $filename]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Sorry, there was an error uploading your file.']);
}
