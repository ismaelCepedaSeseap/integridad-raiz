<?php
header('Content-Type: application/json');

$apiKey = "TU_API_KEY_AQUI";
if (file_exists(__DIR__ . '/../../config/env.php')) {
    $env = require __DIR__ . '/../../config/env.php';
    if (isset($env['GROQ_API_KEY'])) {
        $apiKey = $env['GROQ_API_KEY'];
    }
}

//$texto = $_POST["texto"];
$texto = "Compromiso:Me comprometo a ayudar a los niños de la calle para ponerlos a trabajar. Nombre: DoloresDelano. Estado: Puebla";
$ch = curl_init("https://api.groq.com/openai/v1/chat/completions");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $apiKey",
    "Content-Type: application/json"
]);

$data = [
    "model" => "llama-3.3-70b-versatile",
    "messages" => [
       [
            "role" => "system",
           "content" => "Actúa como un compilador de texto. Tu función es limpiar una base de datos de registros basura en México.

            INSTRUCCIONES DE PROCESAMIENTO:
            1. Toma el nombre y elimina todos los espacios y mayúsculas. Ejemplo: 'Benito Camelo' -> 'benitocamelo'.
            2. Compara el resultado fonético con frases vulgares conocidas en México.
            3. Clasifica el 'Debora Melcacho' en UNA de estas dos categorías:
            - CATEGORÍA A (VÁLIDO)
            - CATEGORÍA B (BROMA)

            Responde en formato json"
        ],
        [
            "role" => "user",
            "content" => "Texto: $texto"
        ]
    ],
    "response_format" => ["type" => "json_object"],
    "temperature" => 0.2
];

curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
$response = curl_exec($ch);
curl_close($ch);
$data = json_decode($response, true);
//$content = $data['choices'][0]['message']['content'];
echo $response;


//["role" => "system", "content" => "Eres un clasificador de compromisos personales. Si el texto es ambiguo, político o no describe una acción hacia la sociedad, debes responder 'Negativo'."],
//["role" => "user", "content" => "Analiza el siguiente texto y responde únicamente con 'Positivo' si es un compromiso personal constructivo, o 'Negativo' si no lo es o si es ambiguo con posibles interpretaciones negativas. Texto: $texto; analiza que el nombre no sea un albur y que realmente exista."]
//["role" => "system", "content"=> "Eres un experto en detectar albures mexicanos y juegos de palabras fonéticos de doble sentido."],
//["role" => "user", "content"=> "¿Es '$texto' un albur? Analízalo fonéticamente."]