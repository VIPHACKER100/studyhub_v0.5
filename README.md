# 📚 StudyHub - Notes & Assignment Sharing Platform (PHP Edition)

A modern, full-featured web platform for students to share and access educational resources including notes, assignments, and study materials. **Now powered by PHP and MySQL for easy deployment on shared hosting like InfinityFree.**

## ✨ Features

### 🔐 Authentication System
- User registration and login with JWT (JSON Web Tokens)
- Secure password hashing with bcrypt
- Role-based access control (User/Admin)
- User profiles with customization

### 📤 Upload & Share
- Upload multiple file types (PDF, DOC, DOCX, PPT, PPTX, TXT, Images)
- Categorize uploads by subjects
- Add tags for better searchability
- Admin approval system for quality control
- Download tracking and view counters
- **Secure file storage**

### 🔍 Search & Discovery
- Advanced search functionality
- Filter by category, type (notes/assignments/resources)
- Pagination for better performance
- Real-time search with debouncing

### 👨‍💼 Admin Panel
- Dashboard with key statistics
- User management (activate/deactivate)
- Upload moderation (approve/reject)
- Category management
- Comprehensive analytics

### 🎨 Modern UI/UX
- Beautiful dark theme with glassmorphism
- Smooth animations and transitions
- Fully responsive design
- Premium gradients and color schemes
- Interactive micro-animations

## 🚀 Technology Stack

### Backend
- **PHP** - Server-side scripting
- **MySQL** - Database
- **PDO** - Secure Database Access
- **JWT** - Authentication (Custom implementation)
- **Apache** - Web Server and Routing (.htaccess)

### Frontend
- **Vanilla JavaScript** - No framework dependencies
- **Modern CSS** - Custom design system
- **HTML5** - Semantic markup
- **Google Fonts (Inter)** - Typography

## 📋 Prerequisites

- **Web Server**: Apache (XAMPP, WAMP, or Shared Hosting)
- **Database**: MySQL
- **PHP**: Version 7.4 or higher

## 🛠️ Installation & Deployment

### Cloud Deployment (InfinityFree)

See **[DEPLOY_INSTRUCTIONS.md](DEPLOY_INSTRUCTIONS.md)** for a step-by-step guide to hosting this on InfinityFree for free.

### Local Development (XAMPP)

1. **Install XAMPP**: Download and install XAMPP from apachefriends.org.
2. **Clone/Copy Project**: Move the contents of `public` folder to `C:\xampp\htdocs\studyhub`.
3. **Start Servers**: Open XAMPP Control Panel and start **Apache** and **MySQL**.
4. **Create Database**: 
   - Open phpMyAdmin (http://localhost/phpmyadmin)
   - Create a database named `studyhub`.
   - Import the schema provided in `DEPLOY_INSTRUCTIONS.md`.
5. **Configure Credentials**:
   - Open `api/config.php`
   - Set `$host = 'localhost';`
   - Set `$username = 'root';`
   - Set `$password = '';` (default XAMPP password is empty)
6. **Run**: Open `http://localhost/studyhub` in your browser.

## 📊 Database Schema

### Users
- id, username, email, password, fullName, role, bio, avatar, isActive, timestamps

### Categories
- id, name, description, icon, color, timestamps

### Uploads
- id, title, description, type, fileName, filePath, fileSize, fileType, tags, downloads, views, isApproved, isActive, userId, categoryId, timestamps

## 📁 Project Structure

```
htdocs/
├── api/
│   ├── admin/           # Admin endpoints (users, dashboard, etc.)
│   ├── auth/            # Auth endpoints (login, register, profile)
│   ├── uploads/         # Upload endpoints (create, list, delete, download)
│   ├── utils/           # Helper scripts (jwt, auth_helper)
│   ├── config.php       # Database configuration
│   └── .htaccess        # API Routing rules
├── css/
│   └── style.css        # Frontend styling
├── js/
│   └── app.js           # Frontend logic
├── uploads/             # Storage for uploaded files
└── index.php            # Main Entry Point
```

## 🐛 Troubleshooting

### 404 Errors on API
If API calls return 404, ensure `mod_rewrite` is enabled in Apache and the `.htaccess` file exists in the `api` folder.

### Database Connection Error
Check `api/config.php` and verify your username, password, and database name.

### File Upload Failed
Ensure the `uploads/` directory exists in the root and has write permissions (chmod 755 or 777).

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Support

For issues, questions, or contributions, please create an issue in the repository.

---

**Built with ❤️ for the student community**
