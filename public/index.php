<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>StudyHub - Share & Learn Together</title>
  <meta name="description" content="StudyHub is a collaborative platform for sharing notes, assignments, and educational resources with students worldwide.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <!-- Navigation -->
  <nav class="navbar" id="navbar">
    <div class="container">
      <div class="nav-content">
        <a href="#" class="logo" onclick="showHome()">
          <span class="logo-icon">📚</span>
          <span class="logo-text">StudyHub</span>
        </a>
        
        <div class="nav-links" id="navLinks">
          <a href="#" onclick="showHome()" class="nav-link active">Home</a>
          <a href="#" onclick="showExplore()" class="nav-link">Explore</a>
          <a href="#" id="adminNavLink" class="nav-link" onclick="showAdmin()" style="display: none;">Admin</a>
        </div>

        <div class="nav-actions" id="navActions">
          <button class="btn btn-outline" onclick="showLogin()">Login</button>
          <button class="btn btn-primary" onclick="showRegister()">Sign Up</button>
        </div>

        <div class="nav-user" id="navUser" style="display: none;">
          <button class="btn btn-primary" onclick="showUploadModal()">
            <span>📤</span> Upload
          </button>
          <div class="user-menu">
            <button class="user-avatar" onclick="toggleUserDropdown()">
              <span id="userAvatar">👤</span>
            </button>
            <div class="user-dropdown" id="userDropdown">
              <div class="user-info">
                <div class="user-name" id="userName">User</div>
                <div class="user-email" id="userEmail">user@email.com</div>
              </div>
              <div class="dropdown-divider"></div>
              <a href="#" onclick="showProfile()" class="dropdown-item">👤 Profile</a>
              <a href="#" onclick="logout()" class="dropdown-item">🚪 Logout</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <!-- Main Content -->
  <main id="mainContent">
    <!-- Home Section -->
    <section id="homeSection" class="hero">
      <div class="hero-bg"></div>
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">
            Share Knowledge,
            <span class="gradient-text">Grow Together</span>
          </h1>
          <p class="hero-subtitle">
            Access thousands of notes, assignments, and study materials shared by students worldwide.
            Join StudyHub and elevate your learning experience.
          </p>
          <div class="hero-actions">
            <button class="btn btn-primary btn-lg" onclick="showRegister()">
              Get Started Free
            </button>
            <button class="btn btn-outline btn-lg" onclick="showExplore()">
              Explore Content
            </button>
          </div>
          <div class="hero-stats">
            <div class="stat">
              <div class="stat-value" id="statsUploads">0</div>
              <div class="stat-label">Resources</div>
            </div>
            <div class="stat">
              <div class="stat-value" id="statsUsers">0</div>
              <div class="stat-label">Students</div>
            </div>
            <div class="stat">
              <div class="stat-value" id="statsDownloads">0</div>
              <div class="stat-label">Downloads</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Explore Section -->
    <section id="exploreSection" class="section" style="display: none;">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Explore Resources</h2>
          <div class="search-bar">
            <span class="search-icon">🔍</span>
            <input type="text" id="searchInput" placeholder="Search notes, assignments..." onkeyup="handleSearch()">
          </div>
        </div>

        <!-- Filters -->
        <div class="filters">
          <div class="filter-group">
            <label class="filter-label">Category:</label>
            <select id="filterCategory" onchange="loadUploads()">
              <option value="">All Categories</option>
            </select>
          </div>
          <div class="filter-group">
            <label class="filter-label">Type:</label>
            <select id="filterType" onchange="loadUploads()">
              <option value="">All Types</option>
              <option value="note">Notes</option>
              <option value="assignment">Assignments</option>
              <option value="resource">Resources</option>
            </select>
          </div>
        </div>

        <!-- Upload Grid -->
        <div class="upload-grid" id="uploadGrid">
          <!-- Uploads will be loaded here -->
        </div>

        <!-- Pagination -->
        <div class="pagination" id="pagination"></div>
      </div>
    </section>

    <!-- Profile Section -->
    <section id="profileSection" class="section" style="display: none;">
      <div class="container">
        <div class="profile-container">
          <div class="profile-header">
            <div class="profile-avatar">
              <span id="profileAvatar">👤</span>
            </div>
            <div class="profile-info">
              <h2 id="profileFullName">User Name</h2>
              <p id="profileUsername">@username</p>
              <p id="profileBio" class="profile-bio"></p>
            </div>
            <button class="btn btn-outline" onclick="showEditProfile()">Edit Profile</button>
          </div>

          <div class="profile-stats">
            <div class="stat-card">
              <div class="stat-icon">📤</div>
              <div class="stat-value" id="profileUploadsCount">0</div>
              <div class="stat-label">Uploads</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">👁️</div>
              <div class="stat-value" id="profileViewsCount">0</div>
              <div class="stat-label">Total Views</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">💾</div>
              <div class="stat-value" id="profileDownloadsCount">0</div>
              <div class="stat-label">Downloads</div>
            </div>
          </div>

          <div class="profile-uploads">
            <h3>My Uploads</h3>
            <div class="upload-grid" id="profileUploadGrid"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Admin Section -->
    <section id="adminSection" class="section" style="display: none;">
      <div class="container">
        <h2 class="section-title">Admin Dashboard</h2>
        
        <!-- Dashboard Stats -->
        <div class="admin-stats">
          <div class="admin-stat-card">
            <div class="stat-icon">👥</div>
            <div class="stat-content">
              <div class="stat-value" id="adminTotalUsers">0</div>
              <div class="stat-label">Total Users</div>
            </div>
          </div>
          <div class="admin-stat-card">
            <div class="stat-icon">📁</div>
            <div class="stat-content">
              <div class="stat-value" id="adminTotalUploads">0</div>
              <div class="stat-label">Total Uploads</div>
            </div>
          </div>
          <div class="admin-stat-card">
            <div class="stat-icon">⏳</div>
            <div class="stat-content">
              <div class="stat-value" id="adminPendingUploads">0</div>
              <div class="stat-label">Pending Approval</div>
            </div>
          </div>
          <div class="admin-stat-card">
            <div class="stat-icon">💾</div>
            <div class="stat-content">
              <div class="stat-value" id="adminTotalDownloads">0</div>
              <div class="stat-label">Total Downloads</div>
            </div>
          </div>
        </div>

        <!-- Admin Tabs -->
        <div class="admin-tabs">
          <button class="tab-btn active" onclick="showAdminTab('pending')">Pending Uploads</button>
          <button class="tab-btn" onclick="showAdminTab('users')">Manage Users</button>
          <button class="tab-btn" onclick="showAdminTab('categories')">Categories</button>
        </div>

        <!-- Pending Uploads Tab -->
        <div class="admin-tab-content" id="adminPendingTab">
          <div class="admin-table-container">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>User</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="pendingUploadsTable"></tbody>
            </table>
          </div>
        </div>

        <!-- Users Tab -->
        <div class="admin-tab-content" id="adminUsersTab" style="display: none;">
          <div class="admin-table-container">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Uploads</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="usersTable"></tbody>
            </table>
          </div>
        </div>

        <!-- Categories Tab -->
        <div class="admin-tab-content" id="adminCategoriesTab" style="display: none;">
          <div class="category-actions">
            <button class="btn btn-primary" onclick="showAddCategoryModal()">+ Add Category</button>
          </div>
          <div class="category-grid" id="categoryGrid"></div>
        </div>
      </div>
    </section>
  </main>

  <!-- Login Modal -->
  <div class="modal" id="loginModal">
    <div class="modal-overlay" onclick="closeModal('loginModal')"></div>
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="modal-title">Welcome Back</h3>
        <button class="modal-close" onclick="closeModal('loginModal')">×</button>
      </div>
      <form id="loginForm" onsubmit="handleLogin(event)">
        <div class="form-group">
          <label>Email</label>
          <input type="email" name="email" required placeholder="your@email.com">
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" name="password" required placeholder="Enter your password">
        </div>
        <button type="submit" class="btn btn-primary btn-block">Login</button>
      </form>
      <p class="modal-footer-text">
        Don't have an account? <a href="#" onclick="showRegister()">Sign up</a>
      </p>
    </div>
  </div>

  <!-- Register Modal -->
  <div class="modal" id="registerModal">
    <div class="modal-overlay" onclick="closeModal('registerModal')"></div>
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="modal-title">Create Account</h3>
        <button class="modal-close" onclick="closeModal('registerModal')">×</button>
      </div>
      <form id="registerForm" onsubmit="handleRegister(event)">
        <div class="form-group">
          <label>Full Name</label>
          <input type="text" name="fullName" required placeholder="John Doe">
        </div>
        <div class="form-group">
          <label>Username</label>
          <input type="text" name="username" required placeholder="johndoe">
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" name="email" required placeholder="your@email.com">
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" name="password" required placeholder="Create a strong password">
        </div>
        <button type="submit" class="btn btn-primary btn-block">Create Account</button>
      </form>
      <p class="modal-footer-text">
        Already have an account? <a href="#" onclick="showLogin()">Login</a>
      </p>
    </div>
  </div>

  <!-- Upload Modal -->
  <div class="modal" id="uploadModal">
    <div class="modal-overlay" onclick="closeModal('uploadModal')"></div>
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="modal-title">Upload Resource</h3>
        <button class="modal-close" onclick="closeModal('uploadModal')">×</button>
      </div>
      <form id="uploadForm" onsubmit="handleUpload(event)">
        <div class="form-group">
          <label>Title</label>
          <input type="text" name="title" required placeholder="Resource title">
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea name="description" rows="3" placeholder="Brief description of the resource"></textarea>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Type</label>
            <select name="type" required>
              <option value="note">Note</option>
              <option value="assignment">Assignment</option>
              <option value="resource">Resource</option>
            </select>
          </div>
          <div class="form-group">
            <label>Category</label>
            <select name="categoryId" id="uploadCategorySelect" required>
              <option value="">Select category</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label>Tags (comma separated)</label>
          <input type="text" name="tags" placeholder="e.g., physics, mechanics, newton">
        </div>
        <div class="form-group">
          <label>File (PDF, DOC, DOCX, PPT, PPTX, TXT, Images - Max 10MB)</label>
          <input type="file" name="file" required accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.jpeg,.png">
        </div>
        <button type="submit" class="btn btn-primary btn-block">Upload</button>
      </form>
    </div>
  </div>

  <!-- Upload Detail Modal -->
  <div class="modal" id="uploadDetailModal">
    <div class="modal-overlay" onclick="closeModal('uploadDetailModal')"></div>
    <div class="modal-content modal-large">
      <div class="modal-header">
        <h3 class="modal-title" id="detailTitle">Resource Details</h3>
        <button class="modal-close" onclick="closeModal('uploadDetailModal')">×</button>
      </div>
      <div class="upload-detail">
        <div class="upload-detail-header">
          <div class="upload-meta">
            <span class="upload-type-badge" id="detailType">Note</span>
            <span class="upload-category" id="detailCategory">Category</span>
          </div>
          <div class="upload-stats-inline">
            <span>👁️ <span id="detailViews">0</span></span>
            <span>💾 <span id="detailDownloads">0</span></span>
          </div>
        </div>
        <p class="upload-description" id="detailDescription"></p>
        <div class="upload-tags" id="detailTags"></div>
        <div class="upload-info">
          <div class="info-item">
            <strong>File:</strong> <span id="detailFileName"></span>
          </div>
          <div class="info-item">
            <strong>Size:</strong> <span id="detailFileSize"></span>
          </div>
          <div class="info-item">
            <strong>Uploaded by:</strong> <span id="detailUser"></span>
          </div>
          <div class="info-item">
            <strong>Date:</strong> <span id="detailDate"></span>
          </div>
        </div>
        <div class="upload-actions">
          <button class="btn btn-primary" id="downloadBtn" onclick="downloadFile()">
            💾 Download
          </button>
          <button class="btn btn-danger" id="deleteBtn" onclick="deleteUpload()" style="display: none;">
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  </div>

  <script src="/js/app.js"></script>
</body>
</html>
