<?php
require_once 'db_connect.php'; // Include the database connection file

header('Content-Type: application/json');

// Handle Get Messages for a Group
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['group_id'])) {
    $group_id = sanitize($_GET['group_id'], $mysqli);

    $sql = "SELECT GroupChatMessage.*, MyUsers.username as sender_name FROM GroupChatMessage
            LEFT JOIN MyUsers ON GroupChatMessage.sender_id = MyUsers.id
            WHERE group_id = $group_id ORDER BY timestamp ASC"; // Remove the single quotes
    $result = $mysqli->query($sql);

    if ($result) {
        $messages = [];
        while ($row = $result->fetch_assoc()) {
            $messages[] = $row;
        }
        echo json_encode(['success' => true, 'messages' => $messages]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Error retrieving messages: ' . $mysqli->error]);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid request method or missing parameters']);
}

$mysqli->close();
?>
