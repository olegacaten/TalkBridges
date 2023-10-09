<?php
header('Content-Type: application/json');

require_once 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['username'])) {
        $username = sanitize($data['username'], $mysqli);

        $sql = "INSERT INTO MyUsers (username) VALUES ('$username')";
        if ($mysqli->query($sql) === TRUE) {
            echo json_encode(['success' => true, 'message' => 'User created']);
        } else {
            echo json_encode(['success' => false, 'error' => 'Error creating user: ' . $mysqli->error]);
        }
    } else {
        echo json_encode(['success' => false, 'error' => 'Missing required parameters']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid request method']);
}

$mysqli->close();
?>
