<?php
// test_db.php - Script to debug database connection

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>Database Connection Test</h1>";

// 1. Check if config.php exists
if (!file_exists('config.php')) {
    die("<p style='color:red'>Error: config.php not found!</p>");
}

echo "<p>Loading config.php...</p>";
include 'config.php';

// 2. Output configured values (masking password)
echo "<h2>Configuration:</h2>";
echo "<ul>";
echo "<li><strong>Host:</strong> " . htmlspecialchars($host) . "</li>";
echo "<li><strong>Database:</strong> " . htmlspecialchars($db_name) . "</li>";
echo "<li><strong>Username:</strong> " . htmlspecialchars($username) . "</li>";
echo "<li><strong>Password:</strong> " . (strlen($password) > 0 ? "********" : "<em>(empty)</em>") . "</li>";
echo "</ul>";

// 3. Test Connection
echo "<h2>Connection Result:</h2>";

try {
    $dsn = "mysql:host=$host;dbname=$db_name;charset=utf8";
    $test_pdo = new PDO($dsn, $username, $password);
    $test_pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "<p style='color:green; font-weight:bold'>✅ Success! Connected to database successfully.</p>";
    
    // 4. Test Table access
    echo "<h3>Table Check:</h3>";
    $tables = $test_pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
    
    if (empty($tables)) {
         echo "<p style='color:orange'>Warning: Connected, but no tables found. Did you import the SQL schema?</p>";
    } else {
         echo "<p>Found " . count($tables) . " tables: " . implode(', ', $tables) . "</p>";
    }

} catch (PDOException $e) {
    echo "<p style='color:red; font-weight:bold'>❌ Connection Failed!</p>";
    echo "<div style='background:#fee; padding:10px; border:1px solid red; font-family:monospace'>";
    echo "Error Message: " . htmlspecialchars($e->getMessage()) . "<br>";
    echo "Code: " . $e->getCode();
    echo "</div>";
    
    echo "<h3>Troubleshooting Tips:</h3>";
    echo "<ul>";
    echo "<li><strong>Access Denied:</strong> Check your username and password. InfinityFree Username usually looks like 'if0_35...'</li>";
    echo "<li><strong>Unknown Database:</strong> Check your Database Name. It also usually starts with 'if0_35..._'</li>";
    echo "<li><strong>Connection Refused/Timeout:</strong> Check your Hostname. It should be like 'sql123.infinityfree.com'.</li>";
    echo "</ul>";
}
?>
