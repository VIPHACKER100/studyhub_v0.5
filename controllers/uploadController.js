const { Upload, User, Category } = require('../models');
const path = require('path');
const fs = require('fs');

// Create new upload
exports.createUpload = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { title, description, type, categoryId, tags } = req.body;

        const upload = await Upload.create({
            title,
            description,
            type,
            categoryId,
            userId: req.user.id,
            fileName: req.file.originalname,
            filePath: req.file.path,
            fileSize: req.file.size,
            fileType: req.file.mimetype,
            tags: tags ? JSON.parse(tags) : [],
            isApproved: req.user.role === 'admin' // Auto-approve admin uploads
        });

        const uploadWithDetails = await Upload.findByPk(upload.id, {
            include: [
                { association: 'user', attributes: ['id', 'username', 'fullName'] },
                { association: 'category', attributes: ['id', 'name'] }
            ]
        });

        res.status(201).json({
            message: 'Upload created successfully',
            upload: uploadWithDetails
        });
    } catch (error) {
        console.error('Create upload error:', error);
        res.status(500).json({ error: 'Failed to create upload' });
    }
};

// Get all uploads (with filters)
exports.getUploads = async (req, res) => {
    try {
        const { type, categoryId, search, page = 1, limit = 12 } = req.query;

        const where = { isActive: true };

        // Only show approved uploads for regular users
        if (!req.user || req.user.role !== 'admin') {
            where.isApproved = true;
        }

        if (type) where.type = type;
        if (categoryId) where.categoryId = categoryId;

        if (search) {
            const { Op } = require('sequelize');
            where[Op.or] = [
                { title: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } }
            ];
        }

        const offset = (page - 1) * limit;

        const { count, rows } = await Upload.findAndCountAll({
            where,
            include: [
                { association: 'user', attributes: ['id', 'username', 'fullName', 'avatar'] },
                { association: 'category', attributes: ['id', 'name', 'color'] }
            ],
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.json({
            uploads: rows,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            total: count
        });
    } catch (error) {
        console.error('Get uploads error:', error);
        res.status(500).json({ error: 'Failed to get uploads' });
    }
};

// Get single upload
exports.getUpload = async (req, res) => {
    try {
        const upload = await Upload.findByPk(req.params.id, {
            include: [
                { association: 'user', attributes: ['id', 'username', 'fullName', 'avatar', 'bio'] },
                { association: 'category', attributes: ['id', 'name', 'color', 'icon'] }
            ]
        });

        if (!upload) {
            return res.status(404).json({ error: 'Upload not found' });
        }

        // Increment view count
        await upload.increment('views');

        res.json({ upload });
    } catch (error) {
        console.error('Get upload error:', error);
        res.status(500).json({ error: 'Failed to get upload' });
    }
};

// Download file
exports.downloadFile = async (req, res) => {
    try {
        const upload = await Upload.findByPk(req.params.id);

        if (!upload) {
            return res.status(404).json({ error: 'Upload not found' });
        }

        if (!upload.isApproved && (!req.user || req.user.role !== 'admin')) {
            return res.status(403).json({ error: 'Upload not approved' });
        }

        // Increment download count
        await upload.increment('downloads');

        res.download(upload.filePath, upload.fileName);
    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({ error: 'Failed to download file' });
    }
};

// Delete upload
exports.deleteUpload = async (req, res) => {
    try {
        const upload = await Upload.findByPk(req.params.id);

        if (!upload) {
            return res.status(404).json({ error: 'Upload not found' });
        }

        // Check permission
        if (req.user.role !== 'admin' && upload.userId !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        // Delete file from filesystem
        if (fs.existsSync(upload.filePath)) {
            fs.unlinkSync(upload.filePath);
        }

        await upload.destroy();

        res.json({ message: 'Upload deleted successfully' });
    } catch (error) {
        console.error('Delete upload error:', error);
        res.status(500).json({ error: 'Failed to delete upload' });
    }
};
