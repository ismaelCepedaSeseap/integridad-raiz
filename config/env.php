<?php
return [
    'DB_HOST' => 'localhost',
    'DB_NAME' => getenv('DB_NAME') ?: 'integridadraiz',
    'DB_USER' => getenv('DB_USER') ?: 'root',
    'DB_PASS' => getenv('DB_PASS') ?: '',
    'GROQ_API_KEY' => getenv('GROQ_API_KEY') ?: '',
    'API_KEY_1' => getenv('API_KEY_1') ?: '',
    'API_KEY_2' => getenv('API_KEY_2') ?: '',
    'API_KEY_3' => getenv('API_KEY_3') ?: '',
    'API_KEY_4' => getenv('API_KEY_4') ?: '',
    'API_KEY_5' => getenv('API_KEY_5') ?: '',
];
