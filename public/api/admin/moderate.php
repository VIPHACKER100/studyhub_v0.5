<?php
require_once '../config.php';
require_once '../utils/auth_helper.php';

$user = requireAuth();
if ($user['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['error' => 'Admin access required']);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

$id = $_GET['id'] ?? null;
$data = getJsonInput();
$isApproved = isset($data['isApproved']) ? $data['isApproved'] : null;

if (!$id || $isApproved === null) {
    http_response_code(400);
    echo json_encode(['error' => 'ID and approval status required']);
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

    $stmt = $pdo->prepare("UPDATE Uploads SET isApproved = ? WHERE id = ?");
    $stmt->execute([$isApproved ? 1 : 0, $id]);

    echo json_encode(['message' => 'Upload moderated successfully']);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to moderate upload']);
}
?>
