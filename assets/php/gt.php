<?php
if (file_exists('../../config/env.php')) {
    $env = require '../../config/env.php';
}
$apiKey = getenv('API_KEY_1') ?: ($env['API_KEY_1'] ?? '');
if ($apiKey === '') {
    http_response_code(500);
    echo json_encode(['error' => 'API key no configurada']);
    exit;
}
$url = "https://generativelanguage.googleapis.com/v1/models?key=$apiKey";

$response = file_get_contents($url);
echo $response;
?>
