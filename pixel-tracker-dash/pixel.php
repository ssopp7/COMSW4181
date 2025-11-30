<?php
session_start();

$session_id = $_SESSION['session_id'] ?? bin2hex(random_bytes(16));

$logFile = __DIR__ . "/pixel_log.txt";

$logEntry = [
    'session_id' => $session_id,
    'time' => date('Y-m-d H:i:s'),
    'ip' => $_SERVER['REMOTE_ADDR'] ?? '',
    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? '',
    'referrer' => $_SERVER['HTTP_REFERER'] ?? '',
    'page' => $_GET['page'] ?? ($_SERVER['REQUEST_URI'] ?? 'unknown')
];

file_put_contents($logFile, json_encode($logEntry) . PHP_EOL, FILE_APPEND);

header('Content-Type: image/gif');
header('Cache-Control: no-cache, no-store, must-revalidate');
echo base64_decode('R0lGODlhAQABAPAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==');
exit;
?>