<?php
header('Content-Type: application/json');

require_once 'db_connect.php'; // Include your database connection file

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Check if chatId is provided in the request
    $data = json_decode(file_get_contents("php://input"));

    if (!isset($data->chatId)) {
        echo json_encode(['success' => false, 'error' => 'chatId parameter is missing']);
        exit;
    }

    $chatId = $data->chatId;

    // Delete messages from GroupChatMessage table
    $sqlDeleteMessages = "DELETE FROM GroupChatMessage WHERE group_id = ?";
    $stmt = $mysqli->prepare($sqlDeleteMessages);
    $stmt->bind_param('i', $chatId);

    if ($stmt->execute()) {
        // Messages deleted successfully, now delete the chat from GroupTable
        $sqlDeleteChat = "DELETE FROM GroupTable WHERE id = ?";
        $stmt = $mysqli->prepare($sqlDeleteChat);
        $stmt->bind_param('i', $chatId);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Chat and messages deleted successfully']);
        } else {
            echo json_encode(['success' => false, 'error' => 'Failed to delete the chat']);
        }
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to delete chat messages']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid request method']);
}

$mysqli->close(); // Close the database connection
?>
