<?php
// config.php - Database Configuration

// Allow CORS
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database Credentials (Update these with InfinityFree details)
$host = 'sqlXXX.infinityfree.com'; // Example: sql123.infinityfree.com
$db_name = 'if0_35xxxxx_studyhub'; // Example: if0_35827361_studyhub
$username = 'if0_35xxxxx';        // Example: if0_35827361
$password = 'YourPassword';       // Your vPanel password

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    // In production, don't show the detailed error
    // http_response_code(500);
    // echo json_encode(['error' => 'Database connection failed']);
    // exit();
    
    // For debugging/development:
    if (strpos($e->getMessage(), 'SQLSTATE[HY000] [2002]') !== false) {
       // Only error if we are sure we are connected to the internet/trying to connect
       // But here we just return the object, we handle errors in the endpoints.
    }
}

// Helper function to get JSON input
function getJsonInput() {
    return json_decode(file_get_contents("php://input"), true);
}

// Polyfill for getallheaders() if not available
if (!function_exists('getallheaders')) {
    function getallheaders() {
        $headers = [];
        foreach ($_SERVER as $name => $value) {
            if (substr($name, 0, 5) == 'HTTP_') {
                $headers[str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))))] = $value;
            }
        }
        return $headers;
    }
}

// Secret key for JWT
define('JWT_SECRET', 'your_jwt_secret_key_change_this_to_something_secure');
?>
