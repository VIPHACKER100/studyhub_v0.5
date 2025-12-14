<?php
require_once '../config.php';
require_once '../utils/auth_helper.php';

$user = requireAuth();
if ($user['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['error' => 'Admin access required']);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;

if ($method === 'GET') {
    try {
        // Fetch users with upload count
         $sql = "SELECT u.*, 
                (SELECT COUNT(*) FROM Uploads up WHERE up.userId = u.id) as uploadsCount
                FROM Users u
                ORDER BY u.createdAt DESC"; 
        
        $stmt = $pdo->query($sql);
        $rows = $stmt->fetchAll();
        
        $users = array_map(function($row) {
             $count = $row['uploadsCount'];
             $uploads = array_fill(0, $count, ['id' => 0]); 
             
             return [
                 'id' => $row['id'],
                 'username' => $row['username'],
                 'email' => $row['email'],
                 'role' => $row['role'],
                 'isActive' => (bool)$row['isActive'],
                 'uploads' => $uploads
             ];
        }, $rows);
        
        echo json_encode(['users' => $users]);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch users']);
    }
}
elseif ($method === 'PUT') {
    if (!$id) {
         http_response_code(400); 
         echo json_encode(['error' => 'User ID required']); 
         exit();
    }

    $data = getJsonInput();
    $isActive = isset($data['isActive']) ? $data['isActive'] : null;
    $role = $data['role'] ?? null;
    
    if ($id == $user['id'] && $isActive === false) {
         http_response_code(400); 
         echo json_encode(['error' => 'Cannot deactivate self']); 
         exit();
    }
    
    try {
        $fields = [];
        $params = [];
        
        if ($isActive !== null) {
            $fields[] = "isActive = ?";
            $params[] = $isActive ? 1 : 0;
        }
        if ($role !== null) {
            $fields[] = "role = ?";
            $params[] = $role;
        }
        
        if (empty($fields)) {
             http_response_code(400);
             echo json_encode(['error' => 'Nothing to update']);
             exit();
        }
        
        $params[] = $id;
        $sql = "UPDATE Users SET " . implode(', ', $fields) . " WHERE id = ?";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        
        echo json_encode(['message' => 'User updated successfully']);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update user']);
    }
}
?>
