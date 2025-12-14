<?php
require_once '../config.php';
require_once '../utils/auth_helper.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;

// GET: List or Single Upload
if ($method === 'GET') {
    if ($id) {
        // === Get Single Upload ===
        try {
            $sql = "SELECT u.*, 
                    usr.username as user_username, usr.fullName as user_fullName, usr.avatar as user_avatar, usr.bio as user_bio,
                    c.name as category_name, c.color as category_color, c.icon as category_icon
                    FROM Uploads u
                    LEFT JOIN Users usr ON u.userId = usr.id
                    LEFT JOIN Categories c ON u.categoryId = c.id
                    WHERE u.id = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$id]);
            $row = $stmt->fetch();

            if (!$row) {
                http_response_code(404);
                echo json_encode(['error' => 'Upload not found']);
                exit();
            }

            // Increment views
            $pdo->prepare("UPDATE Uploads SET views = views + 1 WHERE id = ?")->execute([$id]);
            $row['views']++;

            $upload = [
                'id' => $row['id'],
                'title' => $row['title'],
                'description' => $row['description'],
                'type' => $row['type'],
                'fileName' => $row['fileName'],
                'filePath' => $row['filePath'],
                'fileSize' => $row['fileSize'],
                'fileType' => $row['fileType'],
                'tags' => json_decode($row['tags'] ?? '[]'),
                'downloads' => $row['downloads'] ?? 0,
                'views' => $row['views'],
                'createdAt' => $row['createdAt'],
                'userId' => $row['userId'],
                'isApproved' => $row['isApproved'],
                'user' => [
                    'id' => $row['userId'],
                    'username' => $row['user_username'],
                    'fullName' => $row['user_fullName'],
                    'avatar' => $row['user_avatar'],
                    'bio' => $row['user_bio']
                ],
                'category' => [
                    'id' => $row['categoryId'],
                    'name' => $row['category_name'],
                    'color' => $row['category_color'],
                    'icon' => $row['category_icon']
                ]
            ];

            echo json_encode(['upload' => $upload]);

        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to fetch upload: ' . $e->getMessage()]);
        }
    } else {
        // === Get All (List) ===
        $type = $_GET['type'] ?? null;
        $categoryId = $_GET['categoryId'] ?? null;
        $search = $_GET['search'] ?? null;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 12;
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $offset = ($page - 1) * $limit;

        $user = authenticate();
        $isAdmin = $user && ($user['role'] === 'admin');

        $where = ["u.isActive = 1"];
        $params = [];

        if (!$isAdmin) {
            $where[] = "u.isApproved = 1";
        }

        if ($type) {
            $where[] = "u.type = ?";
            $params[] = $type;
        }
        if ($categoryId) {
            $where[] = "u.categoryId = ?";
            $params[] = $categoryId;
        }
        if ($search) {
            $where[] = "(u.title LIKE ? OR u.description LIKE ?)";
            $params[] = "%$search%";
            $params[] = "%$search%";
        }

        $whereSQL = implode(' AND ', $where);

        try {
            // Count
            $countSql = "SELECT COUNT(*) FROM Uploads u WHERE $whereSQL";
            $stmt = $pdo->prepare($countSql);
            $stmt->execute($params);
            $total = $stmt->fetchColumn();

            // Fetch
            $sql = "SELECT u.*, 
                    usr.username as user_username, usr.fullName as user_fullName, usr.avatar as user_avatar,
                    c.name as category_name, c.color as category_color, c.icon as category_icon
                    FROM Uploads u
                    LEFT JOIN Users usr ON u.userId = usr.id
                    LEFT JOIN Categories c ON u.categoryId = c.id
                    WHERE $whereSQL
                    ORDER BY u.createdAt DESC
                    LIMIT $limit OFFSET $offset";
            
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $rows = $stmt->fetchAll();

            $uploads = array_map(function($row) {
                return [
                    'id' => $row['id'],
                    'title' => $row['title'],
                    'description' => $row['description'],
                    'type' => $row['type'],
                    'views' => $row['views'],
                    'downloads' => $row['downloads'],
                    'createdAt' => $row['createdAt'],
                    'user' => [
                        'id' => $row['userId'],
                        'username' => $row['user_username'],
                        'fullName' => $row['user_fullName'],
                        'avatar' => $row['user_avatar']
                    ],
                    'category' => [
                        'id' => $row['categoryId'],
                        'name' => $row['category_name'],
                        'color' => $row['category_color'],
                        'icon' => $row['category_icon']
                    ]
                ];
            }, $rows);

            echo json_encode([
                'uploads' => $uploads,
                'totalPages' => ceil($total / $limit),
                'currentPage' => $page,
                'total' => $total
            ]);

        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to list uploads']);
        }
    }
}
// POST: Create Upload
elseif ($method === 'POST') {
    $user = requireAuth();

    if (!isset($_FILES['file'])) {
        http_response_code(400);
        echo json_encode(['error' => 'No file uploaded']);
        exit();
    }

    $title = $_POST['title'] ?? '';
    $description = $_POST['description'] ?? '';
    $type = $_POST['type'] ?? 'resource';
    $categoryId = $_POST['categoryId'] ?? null;
    $tags = $_POST['tags'] ?? '[]'; 

    if (!$title || !$categoryId) {
        http_response_code(400);
        echo json_encode(['error' => 'Title and Category are required']);
        exit();
    }

    $targetDir = "../../uploads/"; 
    if (!file_exists($targetDir)) {
        if (!mkdir($targetDir, 0755, true)) {
             // Try one level up if structure is different
             $targetDir = "../uploads/";
        }
    }
    
    $fileInfo = pathinfo($_FILES["file"]["name"]);
    $cleanFileName = preg_replace('/[^A-Za-z0-9_\-\.]/', '_', $fileInfo['filename']);
    $fileName = time() . '_' . $cleanFileName . '.' . $fileInfo['extension'];
    $targetFilePath = $targetDir . $fileName;

    if (move_uploaded_file($_FILES["file"]["tmp_name"], $targetFilePath)) {
        try {
            $isApproved = ($user['role'] === 'admin') ? 1 : 0;
            // DB path relative to public root
            $dbPath = "uploads/" . $fileName;

            $sql = "INSERT INTO Uploads (title, description, type, categoryId, userId, fileName, filePath, fileSize, fileType, tags, isApproved, isActive, createdAt, updatedAt) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())";
            
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                $title, 
                $description, 
                $type, 
                $categoryId, 
                $user['id'], 
                $fileName, 
                $dbPath, 
                $_FILES["file"]["size"], 
                $_FILES["file"]["type"], 
                $tags,
                $isApproved
            ]);

            $uploadId = $pdo->lastInsertId();
            
            $response = [
                'id' => $uploadId,
                'title' => $title,
                'description' => $description,
                'type' => $type,
                'isApproved' => (bool)$isApproved
            ];
            
            http_response_code(201);
            echo json_encode(['message' => 'Upload created successfully', 'upload' => $response]);

        } catch (Exception $e) {
            if (file_exists($targetFilePath)) unlink($targetFilePath);
            http_response_code(500);
            echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
        }
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to save file']);
    }
}
// DELETE: Delete Upload
elseif ($method === 'DELETE') {
    $user = requireAuth();
    
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'No upload ID provided']);
        exit();
    }

    try {
        $stmt = $pdo->prepare("SELECT * FROM Uploads WHERE id = ?");
        $stmt->execute([$id]);
        $upload = $stmt->fetch();

        if (!$upload) {
            http_response_code(404);
            echo json_encode(['error' => 'Upload not found']);
            exit();
        }

        if ($user['role'] !== 'admin' && $user['id'] !== $upload['userId']) {
            http_response_code(403);
            echo json_encode(['error' => 'Not authorized']);
            exit();
        }

        $filePath = "../../" . $upload['filePath'];
        if (file_exists($filePath)) {
            unlink($filePath);
        }

        $pdo->prepare("DELETE FROM Uploads WHERE id = ?")->execute([$id]);

        echo json_encode(['message' => 'Upload deleted successfully']);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to delete upload']);
    }
}
?>
