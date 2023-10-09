<?php
header('Content-Type: application/json');

require_once 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    
    $sql = "SELECT g.id, g.group_name, m.text AS last_message, m.timestamp AS timestamp, g.owner_id, u.username as owner_name
            FROM GroupTable g
            LEFT JOIN (
                SELECT group_id, MAX(timestamp) AS max_timestamp
                FROM GroupChatMessage
                GROUP BY group_id
            ) max_messages ON g.id = max_messages.group_id
            LEFT JOIN GroupChatMessage m ON max_messages.group_id = m.group_id AND max_messages.max_timestamp = m.timestamp
            LEFT JOIN MyUsers u ON g.owner_id = u.id
            ORDER BY timestamp DESC";

    $result = $mysqli->query($sql);

    if ($result) {
        $groups = [];
        while ($row = $result->fetch_assoc()) {
            $groups[] = [
                'id' => $row['id'],
                'group_name' => $row['group_name'],
                'last_message' => $row['last_message'],
                'timestamp' => $row['timestamp'],
                'owner_id' => $row['owner_id'],
                'owner_name' => $row['owner_name']
            ];
        }
        echo json_encode(['success' => true, 'groups' => $groups]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Error fetching groups: ' . $mysqli->error]);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid request method']);
}

$mysqli->close();



?>
