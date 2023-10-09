<?php
require_once 'db_connect.php'; // Include the database connection file

header('Content-Type: application/json');

// Initialize the response array
$response = ['success' => false];

// Handle Get Single User by Name
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['username'])) {
        $username = $_GET['username'];
        $sql = "SELECT id, username FROM MyUsers WHERE username = ?";
        
        // Prepare the SQL statement
        $stmt = $mysqli->prepare($sql);
        
        // Bind the username parameter
        $stmt->bind_param("s", $username);
        
        // Execute the statement
        $stmt->execute();
        
        // Bind the results
        $stmt->bind_result($id, $username);
        
        // Fetch the result
        if ($stmt->fetch()) {
            $response['success'] = true;
            $response['user'] = ['id' => $id, 'username' => $username];
        } else {
            $response['error'] = 'User not found';
        }
        
        // Close the statement
        $stmt->close();
    } else {
        $response['error'] = 'Username parameter is missing';
    }
}

// Close the database connection
$mysqli->close();

// Return the response as JSON
echo json_encode($response);
?>
