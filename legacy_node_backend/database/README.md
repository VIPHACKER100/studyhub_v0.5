# StudyHub Database Documentation

This directory contains all database-related files for the StudyHub platform.

## 📁 Directory Structure

```
database/
├── schema.sql              # Complete SQL schema for manual setup
├── migrations/             # Sequelize migration files
│   ├── 001-create-users.js
│   ├── 002-create-categories.js
│   └── 003-create-uploads.js
└── seeders/               # Sequelize seeder files
    ├── 001-seed-categories.js
    └── 002-seed-admin-user.js
```

## 🚀 Quick Start

### Method 1: Manual Database Setup (Recommended for First Time)

1. **Create the database using SQL file:**
   ```bash
   mysql -u root -p < database/schema.sql
   ```

2. **Verify the setup:**
   ```bash
   mysql -u root -p studyhub -e "SHOW TABLES;"
   ```

### Method 2: Using Sequelize Migrations & Seeders

1. **Install Sequelize CLI globally (if not already installed):**
   ```bash
   npm install -g sequelize-cli
   ```

2. **Run all migrations:**
   ```bash
   npx sequelize-cli db:migrate
   ```

3. **Seed the database with default data:**
   ```bash
   npx sequelize-cli db:seed:all
   ```

4. **Undo last migration (if needed):**
   ```bash
   npx sequelize-cli db:migrate:undo
   ```

5. **Undo all migrations:**
   ```bash
   npx sequelize-cli db:migrate:undo:all
   ```

6. **Undo all seeders:**
   ```bash
   npx sequelize-cli db:seed:undo:all
   ```

## 📊 Database Schema Overview

### Tables

1. **Users** - User account information
   - Authentication (username, email, password)
   - Profile data (fullName, bio, avatar)
   - Role-based access (user, admin)

2. **Categories** - Content categories
   - Name, description, icon, color
   - Used for organizing uploads

3. **Uploads** - File uploads (notes, assignments, resources)
   - Metadata (title, description, type)
   - File information (fileName, filePath, fileSize, fileType)
   - Statistics (downloads, views)
   - Approval system (isApproved)

### Relationships

- `User` ──1:N──> `Upload` (One user has many uploads)
- `Category` ──1:N──> `Upload` (One category has many uploads)

## 🔑 Default Credentials

After seeding, you can login with:

- **Username:** `admin`
- **Email:** `admin@studyhub.com`
- **Password:** `admin123`

**⚠️ Important:** Change the admin password after first login!

## 📝 Creating New Migrations

Create a new migration file:
```bash
npx sequelize-cli migration:generate --name migration-name
```

Example migration structure:
```javascript
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Migration code here
  },

  async down(queryInterface, Sequelize) {
    // Rollback code here
  }
};
```

## 🌱 Creating New Seeders

Create a new seeder file:
```bash
npx sequelize-cli seed:generate --name seeder-name
```

Example seeder structure:
```javascript
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('TableName', [
      { /* data */ },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('TableName', null, {});
  }
};
```

## 📈 Database Views

The schema includes helpful views for statistics:

1. **UserUploadStats** - User upload statistics
2. **CategoryStats** - Category statistics
3. **RecentUploads** - Recently uploaded files

Query example:
```sql
SELECT * FROM UserUploadStats;
SELECT * FROM CategoryStats;
SELECT * FROM RecentUploads LIMIT 10;
```

## 🛠️ Stored Procedures

Available stored procedures:

1. **IncrementDownloadCount(uploadId)** - Increment download count
2. **IncrementViewCount(uploadId)** - Increment view count
3. **GetUserStatistics(userId)** - Get user statistics

Usage example:
```sql
CALL IncrementDownloadCount(1);
CALL IncrementViewCount(1);
CALL GetUserStatistics(1);
```

## 🔍 Full-Text Search

The `Uploads` table has full-text search enabled on `title` and `description`:

```sql
SELECT * FROM Uploads 
WHERE MATCH(title, description) AGAINST('search term' IN NATURAL LANGUAGE MODE);
```

## 🔒 Indexes

All tables have appropriate indexes for optimal performance:

- **Users**: username, email, role, isActive
- **Categories**: name
- **Uploads**: type, userId, categoryId, isApproved, isActive, createdAt

## 📊 Database Statistics

View database size and statistics:
```sql
SELECT 
    TABLE_NAME as 'Table',
    TABLE_ROWS as 'Rows',
    ROUND(((DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024), 2) as 'Size (MB)'
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'studyhub'
ORDER BY (DATA_LENGTH + INDEX_LENGTH) DESC;
```

## 🧪 Testing Your Database

1. **Check connection:**
   ```bash
   mysql -u root -p -e "USE studyhub; SHOW TABLES;"
   ```

2. **Verify data:**
   ```sql
   SELECT COUNT(*) FROM Users;
   SELECT COUNT(*) FROM Categories;
   SELECT COUNT(*) FROM Uploads;
   ```

3. **Test relationships:**
   ```sql
   SELECT u.*, c.name as categoryName 
   FROM Uploads u 
   JOIN Categories c ON u.categoryId = c.id 
   LIMIT 5;
   ```

## 🔄 Migration Best Practices

1. **Always test migrations** in development before production
2. **Never modify existing migrations** that have been run in production
3. **Create new migrations** for schema changes
4. **Write down functions** for rollback capability
5. **Backup database** before running migrations in production

## 📚 Additional Resources

- [Sequelize Documentation](https://sequelize.org/docs/v6/)
- [Sequelize CLI Documentation](https://github.com/sequelize/cli)
- [MySQL Documentation](https://dev.mysql.com/doc/)

## 🆘 Troubleshooting

### Cannot connect to database
```bash
# Check if MySQL is running
mysql -u root -p

# Verify credentials in .env file
DB_HOST=localhost
DB_PORT=3306
DB_NAME=studyhub
DB_USER=root
DB_PASSWORD=your_password
```

### Migration errors
```bash
# Check migration status
npx sequelize-cli db:migrate:status

# Undo last migration
npx sequelize-cli db:migrate:undo

# Fresh start (⚠️ This will delete all data)
npx sequelize-cli db:migrate:undo:all
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

### Foreign key constraint errors
- Make sure parent tables exist before child tables
- Run migrations in order: Users → Categories → Uploads
- Check that referenced IDs exist when inserting data

---

**Last Updated:** 2025-12-14
**Version:** 0.5
