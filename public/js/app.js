// API Configuration
const API_BASE = '/api';

// State Management
const state = {
    user: null,
    token: localStorage.getItem('token'),
    currentPage: 1,
    currentUploadId: null,
    categories: []
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

async function initializeApp() {
    // Check if user is logged in
    if (state.token) {
        await loadProfile();
    }

    // Load initial data
    await loadCategories();
    await loadStatistics();

    // Set up navbar scroll effect
    window.addEventListener('scroll', handleScroll);
}

function handleScroll() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// Navigation
function showHome() {
    hideAllSections();
    document.getElementById('homeSection').style.display = 'block';
    setActiveNav(0);
}

function showExplore() {
    hideAllSections();
    document.getElementById('exploreSection').style.display = 'block';
    setActiveNav(1);
    loadUploads();
}

function showProfile() {
    if (!state.user) {
        showLogin();
        return;
    }
    hideAllSections();
    document.getElementById('profileSection').style.display = 'block';
    loadUserProfile();
}

function showAdmin() {
    if (!state.user || state.user.role !== 'admin') {
        alert('Admin access required');
        return;
    }
    hideAllSections();
    document.getElementById('adminSection').style.display = 'block';
    loadAdminDashboard();
}

function hideAllSections() {
    const sections = document.querySelectorAll('.section, .hero');
    sections.forEach(section => section.style.display = 'none');
}

function setActiveNav(index) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach((link, i) => {
        link.classList.toggle('active', i === index);
    });
}

// Authentication
async function handleLogin(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Login failed');
        }

        state.token = result.token;
        state.user = result.user;
        localStorage.setItem('token', result.token);

        updateUIForLoggedInUser();
        closeModal('loginModal');
        showMessage('Login successful!', 'success');
        showHome();
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

async function handleRegister(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    try {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Registration failed');
        }

        state.token = result.token;
        state.user = result.user;
        localStorage.setItem('token', result.token);

        updateUIForLoggedInUser();
        closeModal('registerModal');
        showMessage('Account created successfully!', 'success');
        showHome();
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

async function loadProfile() {
    try {
        const response = await fetch(`${API_BASE}/auth/profile`, {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to load profile');
        }

        const result = await response.json();
        state.user = result.user;
        updateUIForLoggedInUser();
    } catch (error) {
        console.error('Load profile error:', error);
        logout();
    }
}

function updateUIForLoggedInUser() {
    document.getElementById('navActions').style.display = 'none';
    document.getElementById('navUser').style.display = 'flex';
    document.getElementById('userName').textContent = state.user.fullName;
    document.getElementById('userEmail').textContent = state.user.email;
    document.getElementById('userAvatar').textContent = state.user.avatar || state.user.fullName.charAt(0);

    if (state.user.role === 'admin') {
        document.getElementById('adminNavLink').style.display = 'block';
    }
}

function logout() {
    state.token = null;
    state.user = null;
    localStorage.removeItem('token');

    document.getElementById('navActions').style.display = 'flex';
    document.getElementById('navUser').style.display = 'none';
    document.getElementById('adminNavLink').style.display = 'none';

    showHome();
    showMessage('Logged out successfully', 'success');
}

function toggleUserDropdown() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.classList.toggle('active');
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    const userMenu = document.querySelector('.user-menu');
    if (userMenu && !userMenu.contains(e.target)) {
        document.getElementById('userDropdown').classList.remove('active');
    }
});

// Modals
function showLogin() {
    closeAllModals();
    document.getElementById('loginModal').classList.add('active');
}

function showRegister() {
    closeAllModals();
    document.getElementById('registerModal').classList.add('active');
}

function showUploadModal() {
    if (!state.user) {
        showLogin();
        return;
    }
    closeAllModals();
    populateUploadCategories();
    document.getElementById('uploadModal').classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => modal.classList.remove('active'));
}

// Categories
async function loadCategories() {
    try {
        const response = await fetch(`${API_BASE}/admin/categories`, {
            headers: state.token ? {
                'Authorization': `Bearer ${state.token}`
            } : {}
        });

        if (response.ok) {
            const result = await response.json();
            state.categories = result.categories;
            populateCategoryFilters();
        }
    } catch (error) {
        console.error('Load categories error:', error);
    }
}

function populateCategoryFilters() {
    const select = document.getElementById('filterCategory');
    select.innerHTML = '<option value="">All Categories</option>';

    state.categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = `${category.icon || ''} ${category.name}`;
        select.appendChild(option);
    });
}

function populateUploadCategories() {
    const select = document.getElementById('uploadCategorySelect');
    select.innerHTML = '<option value="">Select category</option>';

    state.categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = `${category.icon || ''} ${category.name}`;
        select.appendChild(option);
    });
}

// Statistics
async function loadStatistics() {
    try {
        // Load public statistics (if available)
        const response = await fetch(`${API_BASE}/uploads?limit=1`);
        if (response.ok) {
            const result = await response.json();
            animateCounter('statsUploads', result.total || 0);
        }
    } catch (error) {
        console.error('Load statistics error:', error);
    }

    // Animate counters with random values for demo
    animateCounter('statsUsers', 1250);
    animateCounter('statsDownloads', 5680);
}

function animateCounter(id, target) {
    const element = document.getElementById(id);
    if (!element) return;

    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = formatNumber(target);
            clearInterval(timer);
        } else {
            element.textContent = formatNumber(Math.floor(current));
        }
    }, 30);
}

function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
}

// Uploads
async function loadUploads(page = 1) {
    const category = document.getElementById('filterCategory').value;
    const type = document.getElementById('filterType').value;
    const search = document.getElementById('searchInput').value;

    const params = new URLSearchParams({
        page,
        limit: 12
    });

    if (category) params.append('categoryId', category);
    if (type) params.append('type', type);
    if (search) params.append('search', search);

    try {
        const response = await fetch(`${API_BASE}/uploads?${params}`);
        const result = await response.json();

        displayUploads(result.uploads);
        displayPagination(result.currentPage, result.totalPages);
        state.currentPage = result.currentPage;
    } catch (error) {
        console.error('Load uploads error:', error);
        showMessage('Failed to load uploads', 'error');
    }
}

function displayUploads(uploads) {
    const grid = document.getElementById('uploadGrid');

    if (uploads.length === 0) {
        grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-state-icon">📭</div>
        <p class="empty-state-text">No resources found</p>
      </div>
    `;
        return;
    }

    grid.innerHTML = uploads.map(upload => `
    <div class="upload-card" onclick="showUploadDetail(${upload.id})">
      <div class="upload-card-header">
        <span class="upload-type-badge ${upload.type}">${upload.type}</span>
      </div>
      <div class="upload-card-content">
        <h3 class="upload-title">${escapeHtml(upload.title)}</h3>
        <p class="upload-description">${escapeHtml(upload.description || '')}</p>
        <div class="upload-meta">
          <span class="upload-category" style="color: ${upload.category?.color || '#6366f1'}">
            ${upload.category?.icon || '📁'} ${upload.category?.name || 'Uncategorized'}
          </span>
        </div>
      </div>
      <div class="upload-footer">
        <div class="upload-author">
          <div class="author-avatar">${upload.user?.fullName?.charAt(0) || '?'}</div>
          <span>${escapeHtml(upload.user?.username || 'Unknown')}</span>
        </div>
        <div class="upload-stats">
          <span>👁️ ${upload.views}</span>
          <span>💾 ${upload.downloads}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function displayPagination(currentPage, totalPages) {
    const container = document.getElementById('pagination');

    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }

    let html = '';

    // Previous button
    html += `<button ${currentPage === 1 ? 'disabled' : ''} onclick="loadUploads(${currentPage - 1})">Previous</button>`;

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            html += `<button class="${i === currentPage ? 'active' : ''}" onclick="loadUploads(${i})">${i}</button>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            html += '<button disabled>...</button>';
        }
    }

    // Next button
    html += `<button ${currentPage === totalPages ? 'disabled' : ''} onclick="loadUploads(${currentPage + 1})">Next</button>`;

    container.innerHTML = html;
}

let searchTimeout;
function handleSearch() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        loadUploads(1);
    }, 500);
}

// Upload Detail
async function showUploadDetail(id) {
    try {
        const response = await fetch(`${API_BASE}/uploads/${id}`);
        const result = await response.json();
        const upload = result.upload;

        state.currentUploadId = id;

        document.getElementById('detailTitle').textContent = upload.title;
        document.getElementById('detailType').textContent = upload.type;
        document.getElementById('detailType').className = `upload-type-badge ${upload.type}`;
        document.getElementById('detailCategory').textContent = upload.category?.name || 'Uncategorized';
        document.getElementById('detailCategory').style.color = upload.category?.color || '#6366f1';
        document.getElementById('detailDescription').textContent = upload.description || 'No description provided';
        document.getElementById('detailViews').textContent = upload.views;
        document.getElementById('detailDownloads').textContent = upload.downloads;
        document.getElementById('detailFileName').textContent = upload.fileName;
        document.getElementById('detailFileSize').textContent = formatFileSize(upload.fileSize);
        document.getElementById('detailUser').textContent = upload.user?.fullName || 'Unknown';
        document.getElementById('detailDate').textContent = new Date(upload.createdAt).toLocaleDateString();

        // Tags
        const tagsContainer = document.getElementById('detailTags');
        if (upload.tags && upload.tags.length > 0) {
            tagsContainer.innerHTML = upload.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('');
        } else {
            tagsContainer.innerHTML = '';
        }

        // Show delete button if user owns the upload or is admin
        const deleteBtn = document.getElementById('deleteBtn');
        if (state.user && (state.user.id === upload.userId || state.user.role === 'admin')) {
            deleteBtn.style.display = 'inline-flex';
        } else {
            deleteBtn.style.display = 'none';
        }

        document.getElementById('uploadDetailModal').classList.add('active');
    } catch (error) {
        console.error('Show upload detail error:', error);
        showMessage('Failed to load upload details', 'error');
    }
}

async function downloadFile() {
    if (!state.currentUploadId) return;

    try {
        window.location.href = `${API_BASE}/uploads/${state.currentUploadId}/download`;
    } catch (error) {
        showMessage('Failed to download file', 'error');
    }
}

async function deleteUpload() {
    if (!state.currentUploadId || !confirm('Are you sure you want to delete this upload?')) return;

    try {
        const response = await fetch(`${API_BASE}/uploads/${state.currentUploadId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete upload');
        }

        closeModal('uploadDetailModal');
        showMessage('Upload deleted successfully', 'success');
        loadUploads(state.currentPage);
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

// Upload File
async function handleUpload(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    // Convert tags to array
    const tagsString = formData.get('tags');
    if (tagsString) {
        const tags = tagsString.split(',').map(t => t.trim()).filter(t => t);
        formData.set('tags', JSON.stringify(tags));
    }

    try {
        const response = await fetch(`${API_BASE}/uploads`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${state.token}`
            },
            body: formData
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Upload failed');
        }

        closeModal('uploadModal');
        event.target.reset();

        const message = state.user.role === 'admin'
            ? 'Upload successful!'
            : 'Upload successful! Pending admin approval.';

        showMessage(message, 'success');

        if (state.user.role === 'admin') {
            loadUploads(1);
        }
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

// Profile
async function loadUserProfile() {
    if (!state.user) return;

    try {
        const response = await fetch(`${API_BASE}/auth/profile`, {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        });

        const result = await response.json();
        const user = result.user;

        document.getElementById('profileAvatar').textContent = user.avatar || user.fullName.charAt(0);
        document.getElementById('profileFullName').textContent = user.fullName;
        document.getElementById('profileUsername').textContent = `@${user.username}`;
        document.getElementById('profileBio').textContent = user.bio || 'No bio yet';

        // Calculate stats
        const uploads = user.uploads || [];
        document.getElementById('profileUploadsCount').textContent = uploads.length;

        // Load user's uploads
        displayUserUploads(uploads);
    } catch (error) {
        console.error('Load user profile error:', error);
        showMessage('Failed to load profile', 'error');
    }
}

function displayUserUploads(uploads) {
    const grid = document.getElementById('profileUploadGrid');

    if (uploads.length === 0) {
        grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-state-icon">📭</div>
        <p class="empty-state-text">No uploads yet</p>
      </div>
    `;
        return;
    }

    // Show basic upload info
    grid.innerHTML = uploads.slice(0, 6).map(upload => `
    <div class="upload-card" onclick="showUploadDetail(${upload.id})">
      <div class="upload-card-header">
        <span class="upload-type-badge ${upload.type}">${upload.type}</span>
      </div>
      <div class="upload-card-content">
        <h3 class="upload-title">${escapeHtml(upload.title)}</h3>
        <div class="upload-meta">
          <span>${new Date(upload.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  `).join('');
}

// Admin Dashboard
async function loadAdminDashboard() {
    try {
        const response = await fetch(`${API_BASE}/admin/dashboard`, {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        });

        const result = await response.json();

        document.getElementById('adminTotalUsers').textContent = result.stats.totalUsers;
        document.getElementById('adminTotalUploads').textContent = result.stats.totalUploads;
        document.getElementById('adminPendingUploads').textContent = result.stats.pendingUploads;
        document.getElementById('adminTotalDownloads').textContent = formatNumber(result.stats.totalDownloads);

        loadPendingUploads();
    } catch (error) {
        console.error('Load admin dashboard error:', error);
        showMessage('Failed to load dashboard', 'error');
    }
}

function showAdminTab(tabName) {
    // Update tab buttons
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach((btn, index) => {
        const tabs = ['pending', 'users', 'categories'];
        btn.classList.toggle('active', tabs[index] === tabName);
    });

    // Show/hide tab content
    document.getElementById('adminPendingTab').style.display = tabName === 'pending' ? 'block' : 'none';
    document.getElementById('adminUsersTab').style.display = tabName === 'users' ? 'block' : 'none';
    document.getElementById('adminCategoriesTab').style.display = tabName === 'categories' ? 'block' : 'none';

    // Load tab data
    if (tabName === 'pending') loadPendingUploads();
    else if (tabName === 'users') loadUsers();
    else if (tabName === 'categories') loadAdminCategories();
}

async function loadPendingUploads() {
    try {
        const response = await fetch(`${API_BASE}/admin/uploads/pending`, {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        });

        const result = await response.json();
        displayPendingUploads(result.uploads);
    } catch (error) {
        console.error('Load pending uploads error:', error);
    }
}

function displayPendingUploads(uploads) {
    const table = document.getElementById('pendingUploadsTable');

    if (uploads.length === 0) {
        table.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--text-secondary);">No pending uploads</td></tr>';
        return;
    }

    table.innerHTML = uploads.map(upload => `
    <tr>
      <td><strong>${escapeHtml(upload.title)}</strong></td>
      <td><span class="upload-type-badge ${upload.type}">${upload.type}</span></td>
      <td>${escapeHtml(upload.user?.username || 'Unknown')}</td>
      <td>${upload.category?.name || 'N/A'}</td>
      <td>${new Date(upload.createdAt).toLocaleDateString()}</td>
      <td>
        <button class="btn btn-success" style="padding: 0.25rem 0.75rem; font-size: 0.75rem;" onclick="moderateUpload(${upload.id}, true)">Approve</button>
        <button class="btn btn-danger" style="padding: 0.25rem 0.75rem; font-size: 0.75rem;" onclick="moderateUpload(${upload.id}, false)">Reject</button>
      </td>
    </tr>
  `).join('');
}

async function moderateUpload(uploadId, isApproved) {
    try {
        const response = await fetch(`${API_BASE}/admin/uploads/${uploadId}/moderate`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${state.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ isApproved })
        });

        if (!response.ok) {
            throw new Error('Failed to moderate upload');
        }

        showMessage(`Upload ${isApproved ? 'approved' : 'rejected'}`, 'success');
        loadPendingUploads();
        loadAdminDashboard();
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

async function loadUsers() {
    try {
        const response = await fetch(`${API_BASE}/admin/users`, {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        });

        const result = await response.json();
        displayUsers(result.users);
    } catch (error) {
        console.error('Load users error:', error);
    }
}

function displayUsers(users) {
    const table = document.getElementById('usersTable');

    table.innerHTML = users.map(user => `
    <tr>
      <td><strong>${escapeHtml(user.username)}</strong></td>
      <td>${escapeHtml(user.email)}</td>
      <td><span class="upload-type-badge">${user.role}</span></td>
      <td>${user.uploads?.length || 0}</td>
      <td><span class="status-badge ${user.isActive ? 'active' : 'inactive'}">${user.isActive ? 'Active' : 'Inactive'}</span></td>
      <td>
        ${user.id !== state.user.id ? `
          <button class="btn ${user.isActive ? 'btn-danger' : 'btn-success'}" style="padding: 0.25rem 0.75rem; font-size: 0.75rem;" onclick="toggleUserStatus(${user.id}, ${!user.isActive})">
            ${user.isActive ? 'Deactivate' : 'Activate'}
          </button>
        ` : '<em style="color: var(--text-muted);">You</em>'}
      </td>
    </tr>
  `).join('');
}

async function toggleUserStatus(userId, isActive) {
    try {
        const response = await fetch(`${API_BASE}/admin/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${state.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ isActive })
        });

        if (!response.ok) {
            throw new Error('Failed to update user');
        }

        showMessage('User updated successfully', 'success');
        loadUsers();
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

async function loadAdminCategories() {
    await loadCategories();
    displayAdminCategories();
}

function displayAdminCategories() {
    const grid = document.getElementById('categoryGrid');

    grid.innerHTML = state.categories.map(category => `
    <div class="category-card">
      <button class="category-delete" onclick="deleteCategory(${category.id})">×</button>
      <div class="category-icon">${category.icon || '📁'}</div>
      <div class="category-name">${escapeHtml(category.name)}</div>
      <div class="category-count">${category.uploads?.length || 0} uploads</div>
    </div>
  `).join('');
}

async function deleteCategory(id) {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
        const response = await fetch(`${API_BASE}/admin/categories/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete category');
        }

        showMessage('Category deleted successfully', 'success');
        loadAdminCategories();
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

function showAddCategoryModal() {
    const name = prompt('Category name:');
    if (!name) return;

    const icon = prompt('Category icon (emoji):');
    const color = prompt('Category color (hex code, e.g., #6366f1):', '#6366f1');

    addCategory(name, icon, color);
}

async function addCategory(name, icon, color) {
    try {
        const response = await fetch(`${API_BASE}/admin/categories`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${state.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, icon, color })
        });

        if (!response.ok) {
            throw new Error('Failed to create category');
        }

        showMessage('Category created successfully', 'success');
        loadAdminCategories();
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

// Utilities
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function showMessage(message, type = 'info') {
    // Create a simple toast notification
    const toast = document.createElement('div');
    toast.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    padding: 1rem 1.5rem;
    background: ${type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--danger)' : 'var(--primary)'};
    color: white;
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-xl);
    z-index: 9999;
    animation: slideInRight 0.3s ease-out;
    max-width: 300px;
  `;
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add toast animations to CSS dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
