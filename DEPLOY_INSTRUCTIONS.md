# Deploying StudyHub to InfinityFree (PHP Version)

You have successfully converted the Node.js backend to PHP! This allows you to host the website on InfinityFree or any standard shared hosting provider.

## Prerequisite
1.  **Database**: You need to create a MySQL database in your InfinityFree control panel. Note down the **hostname**, **database name**, **username**, and **password**.
2.  **Files**: You will strictly upload the content of the `public` folder.

## Integration Steps

### 1. Configure Database Connection
1.  Open `public/api/config.php`.
2.  Update the following variables with your InfinityFree MySQL details:
    ```php
    $host = 'sqlXXX.infinityfree.com'; // Your Database Host
    $db_name = 'if0_35xxxxx_studyhub'; // Your Database Name
    $username = 'if0_35xxxxx';        // Your Database Username
    $password = 'YourPassword';       // Your vPanel Password
    ```

### 2. Upload Files
1.  Connect to your InfinityFree account using FTP (FileZilla) or the Online File Manager.
2.  Navigate to the `htdocs` folder.
3.  **Delete** the default `index2.html` or `index.php` if present.
4.  **Upload the contents** of the `public` folder to `htdocs`. 
    - **IMPORTANT**: Do NOT upload the `public` folder itself. Open `public` on your computer, select all files (`api`, `css`, `js`, `uploads`, `index.php`), and drag them into `htdocs`.
    - Correct path: `htdocs/index.php`
    - Incorrect path: `htdocs/public/index.php`
    - You should see `index.php`, `js`, `css`, and `api` folders directly inside `htdocs`.
5.  Create a new folder named `uploads` inside `htdocs` if it doesn't just exist (it is used to store uploaded files).
    - Ensure `uploads` folder has write permissions (usually 755 or 777).

### 3. Import Database Schema
You need to create the tables in your MySQL database. You can use PHPMyAdmin on InfinityFree.
Run the following SQL Query to create the necessary tables (Run this in the "SQL" tab of your valid Database):

```sql
CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    fullName VARCHAR(100) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    bio TEXT,
    avatar VARCHAR(255),
    isActive TINYINT(1) DEFAULT 1,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(20),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Uploads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    type ENUM('note', 'assignment', 'resource') NOT NULL,
    categoryId INT,
    userId INT,
    fileName VARCHAR(255) NOT NULL,
    filePath VARCHAR(500) NOT NULL,
    fileSize INT NOT NULL,
    fileType VARCHAR(50) NOT NULL,
    tags JSON,
    downloads INT DEFAULT 0,
    views INT DEFAULT 0,
    isApproved TINYINT(1) DEFAULT 0,
    isActive TINYINT(1) DEFAULT 1,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE SET NULL,
    FOREIGN KEY (categoryId) REFERENCES Categories(id) ON DELETE SET NULL
);

-- Optional: Insert Default Categories
INSERT INTO Categories (name, description, icon, color) VALUES 
('Computer Science', 'CS notes and assignments', '💻', '#4f46e5'),
('Mathematics', 'Math resources', '📐', '#0ea5e9'),
('Physics', 'Physics notes', '⚛️', '#10b981');
```

## Troubleshooting
-   **404 Errors on API**: Ensure the `.htaccess` file inside `api` folder was uploaded correctly. Some file managers hide dotfiles.
-   **Database Error**: Check `public/api/config.php` credentials.
-   **Upload Failed**: Check if `uploads` directory exists and is writable.

## Local Testing
If you want to test this PHP version locally, you will need a local server like XAMPP, WAMP, or MAMP.
1.  Move the `public` folder contents to `C:\xampp\htdocs\studyhub`.
2.  Access `http://localhost/studyhub`.
