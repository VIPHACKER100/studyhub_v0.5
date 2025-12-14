# 🚀 StudyHub Local Setup Guide (PHP Version)

This guide will help you set up the StudyHub project locally using a PHP environment (XAMPP).

## 📋 Prerequisites

- **XAMPP** (or WAMP/MAMP)
  - Contains Apache (Web Server)
  - Contains MySQL (Database)
  - Contains PHP (Scripting Language)

## 🛠️ Step-by-Step Installation

### Step 1: Install XAMPP
1. Download XAMPP from [apachefriends.org](https://www.apachefriends.org/index.html).
2. Run the installer and complete the setup.
3. Open **XAMPP Control Panel**.
4. Start **Apache** and **MySQL** modules.

### Step 2: Setup Project Files
1. Navigate to your XAMPP `htdocs` directory.
   - Windows: `C:\xampp\htdocs\`
   - Mac: `/Applications/XAMPP/htdocs/`
2. Create a folder named `studyhub`.
3. Copy the **contents of the `public` folder** from this project into `C:\xampp\htdocs\studyhub\`.
   - Your structure should be:
     ```
     htdocs/studyhub/
     ├── api/
     ├── css/
     ├── js/
     ├── uploads/
     └── index.php
     ```

### Step 3: Configure Database
1. Open your browser and go to `http://localhost/phpmyadmin`.
2. Click **New** in the sidebar.
3. Enter database name: `studyhub` and click **Create**.
4. Click on the `SQL` tab and paste the SQL schema found in **[DEPLOY_INSTRUCTIONS.md](DEPLOY_INSTRUCTIONS.md)**.
5. Click **Go** to run the query and create tables.

### Step 4: Configure Connection
1. Open `C:\xampp\htdocs\studyhub\api\config.php`.
2. Update the credentials for local environment:
   ```php
   $host = 'localhost';
   $db_name = 'studyhub';
   $username = 'root';
   $password = ''; // Default XAMPP password is empty
   ```

### Step 5: Run the App
1. Open your browser.
2. Visit: `http://localhost/studyhub`

## 🐛 Troubleshooting

### API Returns 404
- Ensure `AllowOverride All` is set for the directory in your Apache `httpd.conf`.
- Ensure the `.htaccess` file exists in `api/`.

### "Database connection failed"
- Check if MySQL is running in XAMPP.
- Verify the password in `config.php` (default for root is usually empty string `''`).

### Uploads not working
- Create a folder named `uploads` inside `htdocs/studyhub/` if it doesn't exist.
- Ensure it has write permissions.

## 🔐 Default Admin Account
There is no default admin created by the schema. You need to:
1. Register a new user on the website.
2. Go to `phpMyAdmin`.
3. Browse the `Users` table.
4. Edit your user and change `role` from `user` to `admin`.

---

**Ready to deploy to the cloud? Check [DEPLOY_INSTRUCTIONS.md](DEPLOY_INSTRUCTIONS.md)**
