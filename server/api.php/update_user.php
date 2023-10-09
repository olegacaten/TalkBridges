<?php
require_once 'db_connect.php'; // Include the database connection file

header('Content-Type: application/json');

// Initialize the response array
$response = ['success' => false];

// Handle Update User
if ($_SERVER['REQUEST_METHOD'] === 'PUT' && isset($_GET['id']) && isset($_POST['username']) && isset($_POST['profile_picture'])) {
    $id = sanitize($_GET['id'], $mysqli);
    $username = sanitize($_POST['username'], $mysqli);
    $profile_picture = sanitize($_POST['profile_picture'], $mysqli);
    
    $sql = "UPDATE MyUsers SET username = '$username', profile_picture = '$profile_picture' WHERE id = $id";
    if ($mysqli->query($sql) === TRUE) {
        $response['success'] = true;
        $response['message'] = 'User updated';
    } else {
        $response['error'] = 'Error updating user: ' . $mysqli->error;
    }
}

// Close the database connection
$mysqli->close();

// Return the response as JSON
echo json_encode($response);
?>
