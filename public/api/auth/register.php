<?php
require_once '../config.php';
require_once '../utils/jwt.php';

// Get input
$data = getJsonInput();
$username = $data['username'] ?? '';
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';
$fullName = $data['fullName'] ?? '';

if (!$username || !$email || !$password || !$fullName) {
    http_response_code(400);
    echo json_encode(['error' => 'All fields are required']);
    exit();
}

if (!$pdo) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit();
}

try {
    // Check if email already exists
    $stmt = $pdo->prepare("SELECT id FROM Users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        http_response_code(400);
        echo json_encode(['error' => 'User already exists with this email']);
        exit();
    }

    // Check if username already exists
    $stmt = $pdo->prepare("SELECT id FROM Users WHERE username = ?");
    $stmt->execute([$username]);
    if ($stmt->fetch()) {
        http_response_code(400);
        echo json_encode(['error' => 'Username already taken']);
        exit();
    }

    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    // Insert new user
    // We set isActive = 1 explicitly just in case the DB default isn't set
    $sql = "INSERT INTO Users (username, email, password, fullName, role, isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, 'user', 1, NOW(), NOW())";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$username, $email, $hashedPassword, $fullName]);
    
    $userId = $pdo->lastInsertId();

    // Generate JWT token
    $payload = [
        'id' => $userId,
        'email' => $email,
        'role' => 'user',
        'exp' => time() + (7 * 24 * 60 * 60) // 7 days expiration
    ];
    $token = JWT::encode($payload, JWT_SECRET);

    http_response_code(201);
    echo json_encode([
        'message' => 'User registered successfully',
        'token' => $token,
        'user' => [
            'id' => $userId,
            'username' => $username,
            'email' => $email,
            'fullName' => $fullName,
            'role' => 'user'
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to register user: ' . $e->getMessage()]);
}
?>
