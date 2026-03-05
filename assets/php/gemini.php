<?php
$apiKey = "AIzaSyDude8yZ80Y8jbEhh4sMYfGVhRoN7nvmSM"; 
/*$nombre = "Rosa Melcacho";
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
    echo json_encode(["output" => $result],JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
} else {
    echo json_encode(["error" => "La API no devolvió contenido"]);
}
?>