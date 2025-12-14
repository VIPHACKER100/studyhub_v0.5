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
    $totalUsers = $pdo->query("SELECT COUNT(*) FROM Users")->fetchColumn();
    $totalUploads = $pdo->query("SELECT COUNT(*) FROM Uploads")->fetchColumn();
    $pendingUploads = $pdo->query("SELECT COUNT(*) FROM Uploads WHERE isApproved = 0 AND isActive = 1")->fetchColumn();
    $totalDownloads = $pdo->query("SELECT SUM(downloads) FROM Uploads")->fetchColumn() ?: 0;

    // Recent Uploads
    $stmt = $pdo->query("SELECT u.id, u.title, u.type, u.createdAt,
                         usr.id as user_id, usr.username as user_username, usr.fullName as user_fullName,
                         c.name as category_name
                         FROM Uploads u
                         LEFT JOIN Users usr ON u.userId = usr.id
                         LEFT JOIN Categories c ON u.categoryId = c.id
                         ORDER BY u.createdAt DESC LIMIT 5");
    $rows = $stmt->fetchAll();
    
    $recentUploads = array_map(function($row) {
        return [
            'id' => $row['id'],
            'title' => $row['title'],
            'type' => $row['type'],
            'createdAt' => $row['createdAt'],
            'user' => [
                'id' => $row['user_id'],
                'username' => $row['user_username'],
                'fullName' => $row['user_fullName']
            ],
            'category' => ['name' => $row['category_name']]
        ];
    }, $rows);

    echo json_encode([
        'stats' => [
            'totalUsers' => $totalUsers,
            'totalUploads' => $totalUploads,
            'pendingUploads' => $pendingUploads,
            'totalDownloads' => (int)$totalDownloads
        ],
        'recentUploads' => $recentUploads
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to load dashboard']);
}
?>
