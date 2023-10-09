<?php
header('Content-Type: application/json');

require_once 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['sender_id'], $data['group_id'], $data['text'])) {
        $sender_id = sanitize($data['sender_id'], $mysqli);
        $group_id = sanitize($data['group_id'], $mysqli);
        $text = sanitize($data['text'], $mysqli);

        $sql = "INSERT INTO GroupChatMessage (sender_id, group_id, text) 
                VALUES ('$sender_id', '$group_id', '$text')";

        if ($mysqli->query($sql)) {
            echo json_encode(['success' => true, 'message' => 'Message sent']);
        } else {
            echo json_encode(['success' => false, 'error' => 'Error sending message: ' . $mysqli->error]);
        }
    } else {
        echo json_encode(['success' => false, 'error' => 'Missing required parameters']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid request method']);
}

$mysqli->close();
?>
