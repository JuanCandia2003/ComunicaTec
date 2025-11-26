<?php
header('Content-Type: application/json');
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $postId = $data['id'];

    if (isset($postId)) {
        // Check if the user has already liked this post (optional, for now just increment)
        // ideally we should have a user_likes table, but for this request "different users" 
        // implies just a global counter or a simple cookie based check. 
        // The user asked "que los likes se sumen a pesar de sean diferentes usuarios", 
        // which implies a global counter.
        
        // We will just increment the counter.
        $sql = "UPDATE posts SET likes = likes + 1 WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $postId);
        
        if ($stmt->execute()) {
            // Get the new like count
            $result = $conn->query("SELECT likes FROM posts WHERE id = $postId");
            $row = $result->fetch_assoc();
            echo json_encode(['success' => true, 'likes' => $row['likes']]);
        } else {
            echo json_encode(['success' => false, 'error' => $conn->error]);
        }
        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'error' => 'No post ID provided']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid request method']);
}

$conn->close();
?>
