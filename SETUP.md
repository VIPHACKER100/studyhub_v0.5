# 🚀 StudyHub Setup Guide

## Current Status ✅

The following has been completed:
- ✅ Project structure created
- ✅ All backend files (models, controllers, routes, middleware)
- ✅ Frontend files (HTML, CSS, JavaScript)
- ✅ Dependencies installed
- ✅ Configuration files created

## 📋 Next Steps

### Step 1: Install MySQL

MySQL is required for this project. You need to install it first.

#### Option A: Install via Chocolatey (Recommended for Windows)

```powershell
# Install Chocolatey if you don't have it
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install MySQL
choco install mysql -y
```

#### Option B: Download MySQL Installer

1. Go to https://dev.mysql.com/downloads/installer/
2. Download MySQL Installer for Windows
3. Run the installer and choose "Developer Default"
4. Set a root password during installation (remember this!)
5. Complete the installation

### Step 2: Configure Database

After MySQL is installed, you need to:

1. **Update the `.env` file** with your MySQL password:
   
   Open the file: `c:\Users\Aryan\Desktop\studyhub_v0.5\.env`
   
   Update this line:
   ```
   DB_PASSWORD=your_mysql_root_password_here
   ```

2. **Create the database**:

   Open MySQL command line or MySQL Workbench and run:
   ```sql
   CREATE DATABASE studyhub;
   ```

   OR use the command line:
   ```powershell
   mysql -u root -p -e "CREATE DATABASE studyhub;"
   # Enter your password when prompted
   ```

### Step 3: Seed the Database

Run the seed script to populate the database with initial data:

```powershell
npm run seed
```

This will create:
- Admin user (admin@studyhub.com / admin123)
- 3 sample users
- 6 categories
- 5 sample uploads

### Step 4: Start the Server

For development:
```powershell
npm run dev
```

Or for production:
```powershell
npm start
```

### Step 5: Open the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## 🔐 Default Login Credentials

### Admin Account
- **Email:** admin@studyhub.com
- **Password:** admin123

### Sample Users
- john@example.com / password123
- jane@example.com / password123
- mike@example.com / password123

## ⚠️ Important Notes

1. **Change Admin Password**: After first login, change the admin password for security

2. **Environment Variables**: The `.env` file is gitignored for security. Never commit it to version control.

3. **Database Password**: Make sure to set your actual MySQL root password in the `.env` file

4. **File Uploads**: The `uploads/` directory will be created automatically when you upload the first file

5. **Port Configuration**: If port 3000 is already in use, change the PORT in `.env` file

## 🐛 Troubleshooting

### MySQL Connection Failed
- Verify MySQL service is running
- Check DB_PASSWORD in `.env` matches your MySQL root password
- Ensure the database "studyhub" exists

### Cannot Upload Files
- Check that the `uploads` directory exists and has write permissions
- Verify file size is under 10MB
- Ensure file type is supported (PDF, DOC, DOCX, PPT, PPTX, TXT, Images)

### Port Already in Use
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

## 📚 Quick Start Without MySQL (Alternative)

If you want to test the frontend without setting up MySQL:

1. The frontend will still load at http://localhost:3000
2. You'll see connection errors in the console but can still explore the UI
3. Login and data features won't work until MySQL is configured

## 🎯 Features Overview

Once running, you can:

### As a User:
- ✅ Register and login
- ✅ Browse all uploaded resources
- ✅ Search and filter uploads
- ✅ Upload notes, assignments, resources
- ✅ Download files
- ✅ View your profile and uploads

### As an Admin:
- ✅ Access admin dashboard
- ✅ Approve/reject uploaded content
- ✅ Manage users (activate/deactivate)
- ✅ Create/delete categories
- ✅ View platform statistics

## 📁 Project Structure

```
studyhub_v0.5/
├── config/              # Database configuration
├── controllers/         # Business logic
├── middleware/          # Auth & upload middleware
├── models/             # Database models
├── public/             # Frontend files
│   ├── css/           # Styles
│   ├── js/            # JavaScript
│   └── index.html     # Main page
├── routes/             # API routes
├── uploads/            # Uploaded files (created automatically)
├── .env               # Environment variables
├── package.json       # Dependencies
├── seed.js            # Database seeder
└── server.js          # Entry point
```

## 🆘 Need Help?

Check the README.md file for more detailed information about:
- API endpoints
- Security features
- Customization options
- Database schema
- Future enhancements

---

**Ready to start? Follow Step 1 above to install MySQL!**
