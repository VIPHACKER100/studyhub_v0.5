const { User, Upload, Category } = require('../models');
const { Op } = require('sequelize');

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.count();
        const totalUploads = await Upload.count();
        const pendingUploads = await Upload.count({ where: { isApproved: false, isActive: true } });
        const totalDownloads = await Upload.sum('downloads') || 0;

        const recentUploads = await Upload.findAll({
            limit: 5,
            order: [['createdAt', 'DESC']],
            include: [
                { association: 'user', attributes: ['id', 'username', 'fullName'] },
                { association: 'category', attributes: ['id', 'name'] }
            ]
        });

        res.json({
            stats: {
                totalUsers,
                totalUploads,
                pendingUploads,
                totalDownloads
            },
            recentUploads
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ error: 'Failed to get dashboard stats' });
    }
};

// Get all users
exports.getUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, search } = req.query;

        const where = {};
        if (search) {
            where[Op.or] = [
                { username: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } },
                { fullName: { [Op.like]: `%${search}%` } }
            ];
        }

        const offset = (page - 1) * limit;

        const { count, rows } = await User.findAndCountAll({
            where,
            attributes: { exclude: ['password'] },
            include: [
                {
                    association: 'uploads',
                    attributes: ['id']
                }
            ],
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.json({
            users: rows,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            total: count
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Failed to get users' });
    }
};

// Update user status
exports.updateUserStatus = async (req, res) => {
    try {
        const { userId } = req.params;
        const { isActive, role } = req.body;

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Prevent self-deactivation
        if (user.id === req.user.id && isActive === false) {
            return res.status(400).json({ error: 'Cannot deactivate your own account' });
        }

        await user.update({
            isActive: isActive !== undefined ? isActive : user.isActive,
            role: role || user.role
        });

        res.json({
            message: 'User updated successfully',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                isActive: user.isActive
            }
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
};

// Get pending uploads
exports.getPendingUploads = async (req, res) => {
    try {
        const uploads = await Upload.findAll({
            where: {
                isApproved: false,
                isActive: true
            },
            include: [
                { association: 'user', attributes: ['id', 'username', 'fullName'] },
                { association: 'category', attributes: ['id', 'name'] }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json({ uploads });
    } catch (error) {
        console.error('Get pending uploads error:', error);
        res.status(500).json({ error: 'Failed to get pending uploads' });
    }
};

// Approve/Reject upload
exports.moderateUpload = async (req, res) => {
    try {
        const { uploadId } = req.params;
        const { isApproved } = req.body;

        const upload = await Upload.findByPk(uploadId);

        if (!upload) {
            return res.status(404).json({ error: 'Upload not found' });
        }

        await upload.update({ isApproved });

        res.json({
            message: `Upload ${isApproved ? 'approved' : 'rejected'} successfully`,
            upload
        });
    } catch (error) {
        console.error('Moderate upload error:', error);
        res.status(500).json({ error: 'Failed to moderate upload' });
    }
};

// Manage categories
exports.createCategory = async (req, res) => {
    try {
        const { name, description, icon, color } = req.body;

        const category = await Category.create({
            name,
            description,
            icon,
            color
        });

        res.status(201).json({
            message: 'Category created successfully',
            category
        });
    } catch (error) {
        console.error('Create category error:', error);
        res.status(500).json({ error: 'Failed to create category' });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({
            include: [
                {
                    association: 'uploads',
                    attributes: ['id'],
                    where: { isActive: true, isApproved: true },
                    required: false
                }
            ]
        });

        res.json({ categories });
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({ error: 'Failed to get categories' });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        await category.destroy();

        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Delete category error:', error);
        res.status(500).json({ error: 'Failed to delete category' });
    }
};
