<?php
require_once __DIR__ . "/conexion.php";
require_once "insertarCompromiso.php";
if (file_exists('../../config/env.php')) {
    $env = require '../../config/env.php';
}
/*$apiKey_1 = getenv('API_KEY_1') ?: ($env['API_KEY_1'] ?? 'none');
$apiKey_2 = getenv('API_KEY_2') ?: ($env['API_KEY_2'] ?? 'none');
$apiKey_3 = getenv('API_KEY_3') ?: ($env['API_KEY_3'] ?? 'none');
$apiKey_4 = getenv('API_KEY_4') ?: ($env['API_KEY_4'] ?? 'none');
$apiKey_5 = getenv('API_KEY_5') ?: ($env['API_KEY_5'] ?? 'none');*/

$apiKeys = [
    getenv('API_KEY_1') ?: ($env['API_KEY_1'] ?? 'none'),
    getenv('API_KEY_2') ?: ($env['API_KEY_2'] ?? 'none'),
    getenv('API_KEY_3') ?: ($env['API_KEY_3'] ?? 'none'),
    getenv('API_KEY_4') ?: ($env['API_KEY_4'] ?? 'none'),
    getenv('API_KEY_5') ?: ($env['API_KEY_5'] ?? 'none'),
];
//$apiKey = $apiKeys[array_rand($apiKeys)];
$indexFile = __DIR__ . '/api_index.txt';

// Abrir archivo en modo lectura/escritura
$fp = fopen($indexFile, 'c+');

// Bloquear el archivo (exclusivo)
if (flock($fp, LOCK_EX)) {
    $currentIndex = (int)fread($fp, filesize($indexFile) ?: 1);
    $apiKey = $apiKeys[$currentIndex];

    // Calcular nuevo índice
    $currentIndex = ($currentIndex + 1) % count($apiKeys);

    // Reescribir archivo desde el inicio
    ftruncate($fp, 0);
    rewind($fp);
    fwrite($fp, (string)$currentIndex);

    // Liberar bloqueo
    flock($fp, LOCK_UN);
}
fclose($fp);

//$apiKey = "AIzaSyDude8yZ80Y8jbEhh4sMYfGVhRoN7nvmSM"; 
/*$nombre = "Rosa Fernández";
$estado = "Durango";
$compromiso = "Me comprometo a no tirar chicles en la banqueta de mi colonia";*/
$nombre = $_POST["nombre"];
$estado = $_POST["estado"];
$compromiso = $_POST["compromiso"];
//$prompt = "Analiza el siguiente texto y responde únicamente con 'Positivo' si es un compromiso personal constructivo, o 'Negativo' si no lo es o si es ambiguo con posibles interpretaciones negativas. Texto: \"$texto\"";
//$prompt = "Analiza el siguiente nombre y detecta si es albur, si es albur devuelve Positivo y, de no ser así, Negativo. Nombre: \"$texto\"";
$prompt = "Analiza estos datos y responde únicamente con un objeto JSON
- Nombre: \"$nombre\"
- Estado: \"$estado\"
- Compromiso: \"$compromiso\"

REGLAS DE VALIDACIÓN:
1. NOMBRE: Detecta 'albures' (ej. Rosa Melano, Benito Camelo). Si el nombre es real (ej. Rosa Hernandez), es VÁLIDO.
2. ESTADO: Debe ser uno de los 32 estados de México. Si es una broma (ej. 'Estado de ebriedad'), es NO VÁLIDO.
3. COMPROMISO: Debe ser una acción ciudadana constructiva. Rechaza mensajes políticos, insultos, bromas o frases sin sentido.

Responde estrictamente en formato JSON:
{
  \"nombre_valido\": true/false,
  \"estado_valido\": true/false,
  \"compromiso_valido\": true/false,
  \"analisis_albur\": \"explicación breve si se detectó doble sentido\",
  \"veredicto_final\": \"ACEPTADO/RECHAZADO\"
}";
$url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=$apiKey";
$data = [
    "contents" => [
        ["parts" => [["text" => $prompt]]]
    ],
    "generationConfig" => [
        "temperature" => 0,
        "maxOutputTokens" => 1200,
        "responseMimeType" => "application/json"
    ],
    "safetySettings" => [
        ["category" => "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold" => "BLOCK_NONE"],
        ["category" => "HARM_CATEGORY_HATE_SPEECH", "threshold" => "BLOCK_NONE"],
        ["category" => "HARM_CATEGORY_HARASSMENT", "threshold" => "BLOCK_NONE"],
        ["category" => "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold" => "BLOCK_NONE"]
    ]
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

$response = curl_exec($ch);

if ($response === false) {
    $error = curl_error($ch);
    curl_close($ch);
    echo json_encode(["error" => "Error de conexión: $error"]);
    exit;
}

$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$result = json_decode($response, true);

// Si la API devolvió error
if ($httpCode !== 200) {
    $mensajeError = $result['error']['message'] ?? "Error desconocido";
    echo json_encode([
        "error" => "Error HTTP $httpCode: $mensajeError"
    ]);
    exit;
}


$output = $result['candidates'][0]['content']['parts'][0]['text'] ?? null;

if ($output) {
    $veredictoFinal = json_decode($output, true);
    if($veredictoFinal["veredicto_final"] != "RECHAZADO"){
        insertarMuro($nombre, $estado, $compromiso, $pdo);
    }
    echo json_encode(["output" => $result],JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    
} else {
    echo json_encode(["error" => "La API no devolvió contenido"]);
}
?>