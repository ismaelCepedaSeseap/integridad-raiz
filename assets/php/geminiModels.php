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
$url = "https://generativelanguage.googleapis.com/v1beta/models?key=" . $apiKey;

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);

foreach ($data['models'] as $model) {
    if (strpos($model['name'], 'flash') !== false) {
        echo "Modelo encontrado: " . $model['name'] . "\n";
    }
}
?>
