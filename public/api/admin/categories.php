<?php
require_once '../config.php';
require_once '../utils/auth_helper.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;

if ($method === 'GET') {
    try {
        // Fetch categories with upload count
        $sql = "SELECT c.*, 
                (SELECT COUNT(*) FROM Uploads u WHERE u.categoryId = c.id AND u.isActive = 1 AND u.isApproved = 1) as uploadsCount
                FROM Categories c
                ORDER BY c.name ASC";
        
        $stmt = $pdo->query($sql);
        $categories = $stmt->fetchAll();

        $formatted = array_map(function($row) {
            $count = $row['uploadsCount'];
            // Create dummy array to satisfy frontend expectation of category.uploads.length
            $uploads = array_fill(0, $count, ['id' => 0]);
            return [
                'id' => $row['id'],
                'name' => $row['name'],
                'description' => $row['description'],
                'icon' => $row['icon'],
                'color' => $row['color'],
                'uploads' => $uploads
            ];
        }, $categories);

        echo json_encode(['categories' => $formatted]);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch categories']);
    }
}
elseif ($method === 'POST') {
    $user = requireAuth();
    if ($user['role'] !== 'admin') {
        http_response_code(403);
        echo json_encode(['error' => 'Admin access required']);
        exit();
    }

    $data = getJsonInput();
    $name = $data['name'] ?? '';
    $description = $data['description'] ?? '';
    $icon = $data['icon'] ?? '';
    $color = $data['color'] ?? '';

    if (!$name) {
        http_response_code(400);
        echo json_encode(['error' => 'Name is required']);
        exit();
    }

    try {
        $sql = "INSERT INTO Categories (name, description, icon, color, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$name, $description, $icon, $color]);
        
        $category = [
            'id' => $pdo->lastInsertId(),
            'name' => $name,
            'description' => $description,
            'icon' => $icon,
            'color' => $color,
            'uploads' => []
        ];

        http_response_code(201);
        echo json_encode(['message' => 'Category created successfully', 'category' => $category]);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create category: ' . $e->getMessage()]);
    }
}
elseif ($method === 'DELETE') {
    $user = requireAuth();
    if ($user['role'] !== 'admin') {
        http_response_code(403);
        echo json_encode(['error' => 'Admin access required']);
        exit();
    }
    
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'ID required']);
        exit();
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM Categories WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['message' => 'Category deleted successfully']);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to delete category']);
    }
}
?>
