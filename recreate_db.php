<?php
$host = 'localhost';
$user = 'root';
$pass = '12345';
$dbName = 'integridadraiz';
$sqlFile = __DIR__ . '/assets/js/data/db';

try {
    // 1. Drop and Create Database
    $pdo = new PDO("mysql:host=$host", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "Dropping database '$dbName'...\n";
    $pdo->exec("DROP DATABASE IF EXISTS `$dbName`");
    
    echo "Creating database '$dbName'...\n";
    $pdo->exec("CREATE DATABASE `$dbName` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci");
    
    echo "Database created.\n";
    
    // 2. Import SQL File using MySQL CLI
    if (!file_exists($sqlFile)) {
        die("Error: SQL file not found at $sqlFile\n");
    }
    
    $mysqlPath = 'C:\xampp\mysql\bin\mysql.exe';
    if (!file_exists($mysqlPath)) {
        $mysqlPath = 'mysql';
    }
    
    $cmd = "\"$mysqlPath\" -h$host -u$user -p$pass $dbName < \"$sqlFile\" 2>&1";
    
    echo "Importing data from $sqlFile...\n";
    echo "Command: $cmd\n";
    
    $output = [];
    $returnVar = 0;
    exec($cmd, $output, $returnVar);
    
    echo implode("\n", $output);
    
    if ($returnVar === 0) {
        echo "\nSuccess! Database recreated and imported.\n";
    } else {
        echo "\nError importing database. Exit code: $returnVar\n";
    }

} catch (PDOException $e) {
    die("DB Error: " . $e->getMessage());
}
