<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$raw = file_get_contents('php://input');
$payload = json_decode($raw, true);

if (!is_array($payload)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid payload']);
    exit;
}

function slugify($text) {
    $text = trim((string)$text);
    if ($text === '') {
        return '';
    }
    $text = @iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $text) ?: $text;
    $text = strtolower($text);
    $text = preg_replace('/[^a-z0-9]+/', '-', $text);
    $text = trim($text, '-');
    return $text !== '' ? $text : 'evento';
}

function isAssetPath($value) {
    if (!is_string($value)) return false;
    if (strpos($value, 'assets/images/') !== 0) return false;
    return (bool)preg_match('/\.(jpg|jpeg|png|gif|webp|mp4|webm|mov)$/i', $value);
}

function relocatePath($path, $targetPrefix, $rootPath) {
    if (!is_string($path) || $path === '') {
        return $path;
    }

    $normalized = str_replace('\\', '/', $path);
    if (strpos($normalized, $targetPrefix . '/') === 0) {
        return $normalized;
    }

    $sourceAbsolute = $rootPath . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $normalized);
    if (!file_exists($sourceAbsolute) || !is_file($sourceAbsolute)) {
        return $normalized;
    }

    $targetDirAbsolute = $rootPath . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $targetPrefix);
    if (!is_dir($targetDirAbsolute) && !mkdir($targetDirAbsolute, 0777, true)) {
        return $normalized;
    }

    $fileInfo = pathinfo($normalized);
    $baseName = $fileInfo['basename'] ?? ('archivo_' . uniqid());
    $targetAbsolute = $targetDirAbsolute . DIRECTORY_SEPARATOR . $baseName;
    $targetRelative = $targetPrefix . '/' . $baseName;

    if (file_exists($targetAbsolute)) {
        $name = $fileInfo['filename'] ?? ('archivo_' . uniqid());
        $ext = isset($fileInfo['extension']) ? '.' . $fileInfo['extension'] : '';
        $newBaseName = $name . '_' . uniqid() . $ext;
        $targetAbsolute = $targetDirAbsolute . DIRECTORY_SEPARATOR . $newBaseName;
        $targetRelative = $targetPrefix . '/' . $newBaseName;
    }

    if (@rename($sourceAbsolute, $targetAbsolute)) {
        return $targetRelative;
    }

    if (@copy($sourceAbsolute, $targetAbsolute)) {
        @unlink($sourceAbsolute);
        return $targetRelative;
    }

    return $normalized;
}

function relocateEventAssets($value, $targetPrefix, $rootPath) {
    if (is_array($value)) {
        $result = [];
        foreach ($value as $k => $v) {
            $result[$k] = relocateEventAssets($v, $targetPrefix, $rootPath);
        }
        return $result;
    }
    if (isAssetPath($value)) {
        return relocatePath($value, $targetPrefix, $rootPath);
    }
    return $value;
}

function relocateSingleEvent($event, $rootPath) {
    $state = isset($event['state']) ? (string)$event['state'] : '';
    $titleRaw = isset($event['title']) ? (string)$event['title'] : '';
    $titlePlain = trim(strip_tags($titleRaw));

    $stateSlug = slugify($state);
    $titleSlug = slugify($titlePlain !== '' ? $titlePlain : ($event['id'] ?? 'evento'));

    if ($stateSlug === '' || $titleSlug === '') {
        return $event;
    }

    $targetPrefix = "assets/images/{$stateSlug}/eventos/{$titleSlug}";
    return relocateEventAssets($event, $targetPrefix, $rootPath);
}

$rootPath = realpath(__DIR__ . '/..');

if (isset($payload['events']) && is_array($payload['events'])) {
    $relocatedEvents = [];
    foreach ($payload['events'] as $event) {
        $relocatedEvents[] = is_array($event) ? relocateSingleEvent($event, $rootPath) : $event;
    }
    echo json_encode(['success' => true, 'events' => $relocatedEvents]);
    exit;
}

if (isset($payload['event']) && is_array($payload['event'])) {
    $relocated = relocateSingleEvent($payload['event'], $rootPath);
    echo json_encode(['success' => true, 'event' => $relocated]);
    exit;
}

http_response_code(400);
echo json_encode(['error' => 'Invalid payload']);
