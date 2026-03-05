<?php
header('Content-Type: application/json');

$apiKey = getenv('GROQ_API_KEY');
$texto = isset($_POST['texto']) ? trim((string)$_POST['texto']) : '';

if (!$apiKey) {
    http_response_code(500);
    echo json_encode(['error' => 'GROQ_API_KEY no configurada']);
    exit;
}

if ($texto === '') {
    http_response_code(400);
    echo json_encode(['error' => 'texto es requerido']);
    exit;
}

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
if ($response === false) {
    http_response_code(502);
    echo json_encode(['error' => 'Error en solicitud a Groq']);
    curl_close($ch);
    exit;
}
curl_close($ch);
echo $response;


//["role" => "system", "content" => "Eres un clasificador de compromisos personales. Si el texto es ambiguo, político o no describe una acción hacia la sociedad, debes responder 'Negativo'."],
//["role" => "user", "content" => "Analiza el siguiente texto y responde únicamente con 'Positivo' si es un compromiso personal constructivo, o 'Negativo' si no lo es o si es ambiguo con posibles interpretaciones negativas. Texto: $texto; analiza que el nombre no sea un albur y que realmente exista."]
//["role" => "system", "content"=> "Eres un experto en detectar albures mexicanos y juegos de palabras fonéticos de doble sentido."],
//["role" => "user", "content"=> "¿Es '$texto' un albur? Analízalo fonéticamente."]
