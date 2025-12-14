const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, isAdmin } = require('../middleware/auth');

// All admin routes require authentication and admin role
router.use(authenticate, isAdmin);

router.get('/dashboard', adminController.getDashboardStats);
router.get('/users', adminController.getUsers);
router.put('/users/:userId', adminController.updateUserStatus);
router.get('/uploads/pending', adminController.getPendingUploads);
router.put('/uploads/:uploadId/moderate', adminController.moderateUpload);
router.get('/categories', adminController.getCategories);
router.post('/categories', adminController.createCategory);
router.delete('/categories/:id', adminController.deleteCategory);

module.exports = router;
