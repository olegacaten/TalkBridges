<?php
require_once 'db_connect.php'; // Include the database connection file

header('Content-Type: application/json');

// Initialize the response array
$response = ['success' => false];

// Handle Get All Users
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT * FROM MyUsers";
    $result = $mysqli->query($sql);
    $users = [];

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $users[] = $row;
        }
        $response['success'] = true;
        $response['users'] = $users;
    } else {
        $response['error'] = 'No users found';
    }
}

// Close the database connection
$mysqli->close();

// Return the response as JSON
echo json_encode($response);
?>
