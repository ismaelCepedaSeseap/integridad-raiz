<?php
// Mocking the web environment for CLI execution
$_SERVER['REQUEST_METHOD'] = 'GET';
require_once __DIR__ . '/assets/php/obtenerEstados.php';
