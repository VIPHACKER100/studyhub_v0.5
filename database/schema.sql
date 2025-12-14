-- StudyHub Database Schema
-- MySQL Database Creation Script
-- Generated: 2025-12-14

-- Create database
CREATE DATABASE IF NOT EXISTS studyhub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE studyhub;

-- ============================================
-- Table: Users
-- Description: Stores user account information
-- ============================================
CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    fullName VARCHAR(100) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    bio TEXT,
    avatar VARCHAR(255),
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_isActive (isActive)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: Categories
-- Description: Stores content categories
-- ============================================
CREATE TABLE IF NOT EXISTS Categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(20),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: Uploads
-- Description: Stores uploaded files (notes, assignments, resources)
-- ============================================
CREATE TABLE IF NOT EXISTS Uploads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    type ENUM('note', 'assignment', 'resource') NOT NULL,
    fileName VARCHAR(255) NOT NULL,
    filePath VARCHAR(500) NOT NULL,
    fileSize INT NOT NULL,
    fileType VARCHAR(50) NOT NULL,
    tags JSON,
    downloads INT DEFAULT 0,
    views INT DEFAULT 0,
    isApproved BOOLEAN DEFAULT FALSE,
    isActive BOOLEAN DEFAULT TRUE,
    userId INT NOT NULL,
    categoryId INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (categoryId) REFERENCES Categories(id) ON DELETE RESTRICT,
    INDEX idx_type (type),
    INDEX idx_userId (userId),
    INDEX idx_categoryId (categoryId),
    INDEX idx_isApproved (isApproved),
    INDEX idx_isActive (isActive),
    INDEX idx_createdAt (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Insert Default Categories
-- ============================================
INSERT INTO Categories (name, description, icon, color) VALUES
('Computer Science', 'Programming, algorithms, data structures', '💻', '#3B82F6'),
('Mathematics', 'Calculus, algebra, statistics', '📐', '#8B5CF6'),
('Physics', 'Mechanics, thermodynamics, electromagnetism', '⚛️', '#10B981'),
('Chemistry', 'Organic, inorganic, physical chemistry', '🧪', '#F59E0B'),
('Biology', 'Genetics, ecology, microbiology', '🧬', '#EC4899'),
('Engineering', 'Mechanical, electrical, civil engineering', '⚙️', '#6366F1'),
('Business', 'Management, finance, marketing', '💼', '#14B8A6'),
('Literature', 'English, creative writing, linguistics', '📚', '#F97316'),
('History', 'World history, ancient civilizations', '🏛️', '#84CC16'),
('General', 'Miscellaneous topics', '📝', '#6B7280')
ON DUPLICATE KEY UPDATE name=name;

-- ============================================
-- Insert Default Admin User
-- Password: admin123 (hashed with bcrypt)
-- ============================================
INSERT INTO Users (username, email, password, fullName, role, bio, isActive) VALUES
('admin', 'admin@studyhub.com', '$2a$10$0192023a7bbd73250516f069df18b500', 'System Administrator', 'admin', 'Default system administrator account', TRUE)
ON DUPLICATE KEY UPDATE username=username;

-- ============================================
-- Create Views for Statistics
-- ============================================

-- View: User Upload Statistics
CREATE OR REPLACE VIEW UserUploadStats AS
SELECT 
    u.id,
    u.username,
    u.fullName,
    COUNT(up.id) as totalUploads,
    SUM(up.downloads) as totalDownloads,
    SUM(up.views) as totalViews,
    SUM(CASE WHEN up.isApproved = TRUE THEN 1 ELSE 0 END) as approvedUploads
FROM Users u
LEFT JOIN Uploads up ON u.id = up.userId
GROUP BY u.id, u.username, u.fullName;

-- View: Category Statistics
CREATE OR REPLACE VIEW CategoryStats AS
SELECT 
    c.id,
    c.name,
    COUNT(up.id) as totalUploads,
    SUM(up.downloads) as totalDownloads,
    SUM(up.views) as totalViews
FROM Categories c
LEFT JOIN Uploads up ON c.id = up.categoryId
GROUP BY c.id, c.name;

-- View: Recent Uploads
CREATE OR REPLACE VIEW RecentUploads AS
SELECT 
    up.id,
    up.title,
    up.type,
    up.fileName,
    up.downloads,
    up.views,
    up.isApproved,
    up.createdAt,
    u.username,
    u.fullName,
    c.name as categoryName,
    c.color as categoryColor
FROM Uploads up
JOIN Users u ON up.userId = u.id
JOIN Categories c ON up.categoryId = c.id
WHERE up.isActive = TRUE
ORDER BY up.createdAt DESC;

-- ============================================
-- Stored Procedures
-- ============================================

-- Procedure: Increment Download Count
DELIMITER //
CREATE PROCEDURE IncrementDownloadCount(IN uploadId INT)
BEGIN
    UPDATE Uploads 
    SET downloads = downloads + 1 
    WHERE id = uploadId;
END //
DELIMITER ;

-- Procedure: Increment View Count
DELIMITER //
CREATE PROCEDURE IncrementViewCount(IN uploadId INT)
BEGIN
    UPDATE Uploads 
    SET views = views + 1 
    WHERE id = uploadId;
END //
DELIMITER ;

-- Procedure: Get User Statistics
DELIMITER //
CREATE PROCEDURE GetUserStatistics(IN userId INT)
BEGIN
    SELECT 
        COUNT(*) as totalUploads,
        SUM(downloads) as totalDownloads,
        SUM(views) as totalViews,
        SUM(CASE WHEN isApproved = TRUE THEN 1 ELSE 0 END) as approvedUploads,
        SUM(CASE WHEN isApproved = FALSE THEN 1 ELSE 0 END) as pendingUploads
    FROM Uploads
    WHERE userId = userId AND isActive = TRUE;
END //
DELIMITER ;

-- ============================================
-- Triggers
-- ============================================

-- Trigger: Validate email format before insert
DELIMITER //
CREATE TRIGGER before_user_insert 
BEFORE INSERT ON Users
FOR EACH ROW
BEGIN
    IF NEW.email NOT REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid email format';
    END IF;
END //
DELIMITER ;

-- Trigger: Validate email format before update
DELIMITER //
CREATE TRIGGER before_user_update 
BEFORE UPDATE ON Users
FOR EACH ROW
BEGIN
    IF NEW.email NOT REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid email format';
    END IF;
END //
DELIMITER ;

-- ============================================
-- Full-Text Search Indexes
-- ============================================

-- Add full-text search for uploads
ALTER TABLE Uploads ADD FULLTEXT INDEX ft_upload_search (title, description);

-- ============================================
-- Database Information
-- ============================================

-- Display table information
SELECT 
    TABLE_NAME as 'Table',
    TABLE_ROWS as 'Rows',
    ROUND(((DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024), 2) as 'Size (MB)'
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'studyhub'
ORDER BY (DATA_LENGTH + INDEX_LENGTH) DESC;
