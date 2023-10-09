<?php
header('Content-Type: application/json');

require_once 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['group_name'], $data['owner_id'])) {
        $group_name = sanitize($data['group_name'], $mysqli);
        $owner_id = sanitize($data['owner_id'], $mysqli);

        $sql = "INSERT INTO GroupTable (group_name, owner_id) 
                VALUES ('$group_name', '$owner_id')";

        if ($mysqli->query($sql)) {
            echo json_encode(['success' => true, 'message' => 'Group created']);
        } else {
            echo json_encode(['success' => false, 'error' => 'Error creating group: ' . $mysqli->error]);
        }
    } else {
        echo json_encode(['success' => false, 'error' => 'Missing required parameters']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid request method']);
}

$mysqli->close();
?>
