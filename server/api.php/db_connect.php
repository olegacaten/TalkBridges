<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database configuration
$host = 'localhost';
$user = 'ch19854_chatapp';
$password = 'password';
$database = 'ch19854_chatapp';

// Create a database connection
$mysqli = new mysqli($host, $user, $password, $database);

if ($mysqli->connect_error) {
    die(json_encode(['error' => 'Connection failed: ' . $mysqli->connect_error]));
}

function sanitize($data, $mysqli) {
    return $mysqli->real_escape_string($data);
}
?>
