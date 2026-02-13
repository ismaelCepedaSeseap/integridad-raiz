<?php
$apiKey = "AIzaSyAGnDAvLyv1wmpEha0bQLpKN4KVJe0u1s0";
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