<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

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

$target_dir = "../images/uploads/";
if (!file_exists($target_dir)) {
    mkdir($target_dir, 0777, true);
}

$file = $_FILES['image'];
$filename = uniqid() . '_' . basename($file['name']);
$target_file = $target_dir . $filename;
$imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

// Check if image file is a actual image or fake image
$check = getimagesize($file['tmp_name']);
if ($check === false) {
    echo json_encode(['error' => 'File is not an image.']);
    exit;
}

// Allow certain file formats
if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" && $imageFileType != "gif" && $imageFileType != "webp" && $imageFileType != "mp4" ) {
    echo json_encode(['error' => 'Sorry, only JPG, JPEG, PNG, GIF, WEBP & MP4 files are allowed.']);
    exit;
}

if (move_uploaded_file($file['tmp_name'], $target_file)) {
    echo json_encode(['success' => true, 'path' => 'images/uploads/' . $filename]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Sorry, there was an error uploading your file.']);
}
