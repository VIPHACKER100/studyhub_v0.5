<?php
require_once '../config.php';
require_once '../utils/jwt.php';

// Auth middleware check
$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? ''; // Case insensitive check
$token = str_replace('Bearer ', '', $authHeader);

if (!$token) {
    http_response_code(401);
    echo json_encode(['error' => 'No token provided']);
    exit();
}

$decoded = JWT::decode($token, JWT_SECRET);
if (!$decoded) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid token']);
    exit();
}

$userId = $decoded['id'];

if (!$pdo) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit();
}

// Handle GET (Get Profile)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $pdo->prepare("SELECT id, username, email, fullName, role, bio, avatar, createdAt FROM Users WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch();

        if (!$user) {
            http_response_code(404);
            echo json_encode(['error' => 'User not found']);
            exit();
        }

        // Get uploads for user
        $stmtUploads = $pdo->prepare("SELECT id, title, type, createdAt FROM Uploads WHERE userId = ? ORDER BY createdAt DESC");
        $stmtUploads->execute([$userId]);
        $uploads = $stmtUploads->fetchAll();
        
        $user['uploads'] = $uploads;

        echo json_encode(['user' => $user]);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch profile: ' . $e->getMessage()]);
    }
}
// Handle PUT (Update Profile)
else if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = getJsonInput();
    $fullName = $data['fullName'] ?? null;
    $bio = $data['bio'] ?? null;
    $avatar = $data['avatar'] ?? null;

    try {
        // Build dynamic update query
        $fields = [];
        $params = [];
        
        if ($fullName !== null) {
            $fields[] = "fullName = ?";
            $params[] = $fullName;
        }
        if ($bio !== null) {
            $fields[] = "bio = ?";
            $params[] = $bio;
        }
        if ($avatar !== null) {
            $fields[] = "avatar = ?";
            $params[] = $avatar;
        }

        if (empty($fields)) {
            // Nothing to update is technically okay, just return user
        } else {
            $params[] = $userId; // For WHERE clause
            $sql = "UPDATE Users SET " . implode(', ', $fields) . " WHERE id = ?";
            
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
        }

        // Fetch updated user
        $stmt = $pdo->prepare("SELECT id, username, email, fullName, bio, avatar, role FROM Users WHERE id = ?");
        $stmt->execute([$userId]);
        $updatedUser = $stmt->fetch();

        echo json_encode([
            'message' => 'Profile updated successfully',
            'user' => $updatedUser
        ]);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update profile: ' . $e->getMessage()]);
    }
}
?>
