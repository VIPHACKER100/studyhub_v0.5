# 📚 StudyHub - Notes & Assignment Sharing Platform

A modern, full-featured web platform for students to share and access educational resources including notes, assignments, and study materials.

## ✨ Features

### 🔐 Authentication System
- User registration and login with JWT
- Secure password hashing with bcrypt
- Role-based access control (User/Admin)
- User profiles with customization

### 📤 Upload & Share
- Upload multiple file types (PDF, DOC, DOCX, PPT, PPTX, TXT, Images)
- Categorize uploads by subjects
- Add tags for better searchability
- Admin approval system for quality control
- Download tracking and view counters

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
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **Sequelize** - ORM
- **JWT** - Authentication
- **Multer** - File uploads
- **bcryptjs** - Password hashing

### Frontend
- **Vanilla JavaScript** - No framework dependencies
- **Modern CSS** - Custom design system
- **HTML5** - Semantic markup
- **Google Fonts (Inter)** - Typography

## 📋 Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager

## 🛠️ Installation

### 1. Clone or navigate to the project directory

```powershell
cd studyhub_v0.5
```

### 2. Install dependencies

```powershell
npm install
```

### 3. Set up MySQL Database

Make sure MySQL is running. Create a database:

```sql
CREATE DATABASE studyhub;
```

### 4. Configure Environment Variables

Copy the example environment file and update with your configuration:

```powershell
cp .env.example .env
```

Edit `.env` file with your database credentials:

```env
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=studyhub
DB_USER=root
DB_PASSWORD=your_mysql_password

# JWT Secret (change this to a random string)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Admin Credentials
ADMIN_EMAIL=admin@studyhub.com
ADMIN_PASSWORD=admin123
```

### 5. Seed the Database

Populate the database with initial data including admin user and sample content:

```powershell
npm run seed
```

This will create:
- Admin user
- Sample users
- Categories (Computer Science, Mathematics, Physics, etc.)
- Sample uploads

### 6. Start the Server

For development with auto-reload:

```powershell
npm run dev
```

For production:

```powershell
npm start
```

The application will be available at **http://localhost:3000**

## 🔑 Default Credentials

### Admin Account
- **Email:** admin@studyhub.com
- **Password:** admin123

### Sample User Accounts
- **Email:** john@example.com | **Password:** password123
- **Email:** jane@example.com | **Password:** password123
- **Email:** mike@example.com | **Password:** password123

**⚠️ Important: Change the admin password after first login!**

## 📁 Project Structure

```
studyhub_v0.5/
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── uploadController.js  # Upload management
│   └── adminController.js   # Admin operations
├── middleware/
│   ├── auth.js             # JWT authentication
│   └── upload.js           # File upload handling
├── models/
│   ├── User.js             # User model
│   ├── Category.js         # Category model
│   ├── Upload.js           # Upload model
│   └── index.js            # Model associations
├── public/
│   ├── css/
│   │   └── style.css       # Complete styling
│   ├── js/
│   │   └── app.js          # Frontend application
│   └── index.html          # Main HTML page
├── routes/
│   ├── auth.js             # Auth routes
│   ├── uploads.js          # Upload routes
│   └── admin.js            # Admin routes
├── uploads/                # Uploaded files storage
├── .env                    # Environment variables
├── .gitignore
├── package.json
├── seed.js                 # Database seeding script
├── server.js               # Application entry point
└── README.md
```

## 🎯 Usage Guide

### For Students

1. **Register an Account**
   - Click "Sign Up" in the navigation
   - Fill in your details
   - Verify your email (optional in current version)

2. **Browse Resources**
   - Click "Explore" to see all available resources
   - Use search and filters to find specific content
   - Click on any card to view details

3. **Upload Resources**
   - Login to your account
   - Click "Upload" button
   - Fill in details and select your file
   - Wait for admin approval (unless you're an admin)

4. **Download Resources**
   - Click on any resource card
   - View details in the modal
   - Click "Download" button

### For Admins

1. **Access Admin Panel**
   - Login with admin credentials
   - Click "Admin" in navigation

2. **Moderate Uploads**
   - View pending uploads
   - Approve or reject submissions
   - Monitor all uploads

3. **Manage Users**
   - View all registered users
   - Activate or deactivate accounts
   - Change user roles

4. **Manage Categories**
   - Add new categories
   - Set category icons and colors
   - Delete unused categories

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt with salt rounds
- **Rate Limiting** - Protection against brute force
- **File Type Validation** - Only approved file types
- **File Size Limits** - 10MB maximum
- **SQL Injection Protection** - Sequelize ORM
- **XSS Protection** - Input sanitization

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Uploads
- `POST /api/uploads` - Create upload (requires auth)
- `GET /api/uploads` - Get all uploads (with filters)
- `GET /api/uploads/:id` - Get single upload
- `GET /api/uploads/:id/download` - Download file
- `DELETE /api/uploads/:id` - Delete upload (requires auth)

### Admin (requires admin role)
- `GET /api/admin/dashboard` - Get statistics
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:userId` - Update user
- `GET /api/admin/uploads/pending` - Get pending uploads
- `PUT /api/admin/uploads/:uploadId/moderate` - Approve/reject
- `GET /api/admin/categories` - Get categories
- `POST /api/admin/categories` - Create category
- `DELETE /api/admin/categories/:id` - Delete category

## 🎨 Customization

### Changing Colors

Edit `public/css/style.css` and modify CSS variables:

```css
:root {
  --primary: #6366f1;        /* Primary color */
  --secondary: #8b5cf6;      /* Secondary color */
  --success: #10b981;        /* Success color */
  --danger: #ef4444;         /* Danger color */
  /* ... more variables */
}
```

### Adding New File Types

Edit `middleware/upload.js` and add to `allowedTypes`:

```javascript
const allowedTypes = [
  'application/pdf',
  'your/mime-type',  // Add here
  // ...
];
```

## 📊 Database Schema

### Users
- id, username, email, password, fullName, role, bio, avatar, isActive, timestamps

### Categories
- id, name, description, icon, color, timestamps

### Uploads
- id, title, description, type, fileName, filePath, fileSize, fileType, tags, downloads, views, isApproved, isActive, userId, categoryId, timestamps

## 🐛 Troubleshooting

### Database Connection Issues
- Verify MySQL is running
- Check `.env` database credentials
- Ensure database exists

### File Upload Issues
- Check `uploads/` directory exists and is writable
- Verify file size and type restrictions
- Check disk space

### Port Already in Use
- Change PORT in `.env` file
- Or kill the process using the port

## 📝 Future Enhancements

- [ ] Email verification
- [ ] Password reset functionality
- [ ] Comments and ratings on uploads
- [ ] User bookmarks/favorites
- [ ] Advanced analytics dashboard
- [ ] File preview functionality
- [ ] Real-time notifications
- [ ] Social sharing features
- [ ] Mobile app version

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Support

For issues, questions, or contributions, please create an issue in the repository.

---

**Built with ❤️ for the student community**
