<?php
require_once '../config.php';
require_once '../utils/auth_helper.php';

$user = requireAuth();
if ($user['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['error' => 'Admin access required']);
    exit();
}

try {
    $sql = "SELECT u.*, 
            usr.username as user_username, usr.fullName as user_fullName,
            c.name as category_name
            FROM Uploads u
            LEFT JOIN Users usr ON u.userId = usr.id
            LEFT JOIN Categories c ON u.categoryId = c.id
            WHERE u.isApproved = 0 AND u.isActive = 1
            ORDER BY u.createdAt DESC";
    
    $stmt = $pdo->query($sql);
    $rows = $stmt->fetchAll();

    $uploads = array_map(function($row) {
        return [
            'id' => $row['id'],
            'title' => $row['title'],
            'type' => $row['type'],
            'createdAt' => $row['createdAt'],
            'user' => [
                'id' => $row['userId'],
                'username' => $row['user_username'],
                'fullName' => $row['user_fullName']
            ],
            'category' => [
                'id' => $row['categoryId'],
                'name' => $row['category_name']
            ]
        ];
    }, $rows);

    echo json_encode(['uploads' => $uploads]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to load pending uploads']);
}
?>
