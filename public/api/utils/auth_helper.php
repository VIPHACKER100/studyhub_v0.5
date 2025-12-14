<?php
require_once 'jwt.php';

function authenticate() {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    // Handle cases where Authorization header might be REDIRECT_HTTP_AUTHORIZATION (Apache sometimes does this)
    if (!$authHeader && isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        $authHeader = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    }
    
    $token = str_replace('Bearer ', '', $authHeader);

    if (!$token) return null;

    return JWT::decode($token, JWT_SECRET);
}

function requireAuth() {
    $user = authenticate();
    if (!$user) {
        http_response_code(401);
        echo json_encode(['error' => 'Authentication required']);
        exit();
    }
    return $user;
}
?>
