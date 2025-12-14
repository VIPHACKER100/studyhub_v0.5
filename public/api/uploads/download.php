<?php
require_once '../config.php';
require_once '../utils/auth_helper.php';

$id = $_GET['id'] ?? null;
if (!$id) {
    http_response_code(404);
    die("File not found");
}

try {
    $stmt = $pdo->prepare("SELECT * FROM Uploads WHERE id = ?");
    $stmt->execute([$id]);
    $upload = $stmt->fetch();

    if (!$upload) {
        http_response_code(404);
        die("File not found");
    }

    // Check approval
    if (!$upload['isApproved']) {
         // Check if admin or owner
         $user = authenticate();
         if (!$user || ($user['role'] !== 'admin' && $user['id'] !== $upload['userId'])) {
             http_response_code(403);
             die("Access denied");
         }
    }

    // Path relative to this file
    $filePath = "../../" . $upload['filePath'];

    if (file_exists($filePath)) {
        // Increment downloads
        $pdo->prepare("UPDATE Uploads SET downloads = downloads + 1 WHERE id = ?")->execute([$id]);

        header('Content-Description: File Transfer');
        header('Content-Type: ' . ($upload['fileType'] ?: 'application/octet-stream'));
        header('Content-Disposition: attachment; filename="'.basename($upload['fileName']).'"');
        header('Expires: 0');
        header('Cache-Control: must-revalidate');
        header('Pragma: public');
        header('Content-Length: ' . filesize($filePath));
        flush(); // Flush system output buffer
        readfile($filePath);
        exit;
    } else {
        http_response_code(404);
        die("File not found on server");
    }

} catch (Exception $e) {
    http_response_code(500);
    die("Server Error");
}
?>
