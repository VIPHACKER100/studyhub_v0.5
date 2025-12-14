const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { authenticate } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', authenticate, upload.single('file'), uploadController.createUpload);
router.get('/', uploadController.getUploads);
router.get('/:id', uploadController.getUpload);
router.get('/:id/download', uploadController.downloadFile);
router.delete('/:id', authenticate, uploadController.deleteUpload);

module.exports = router;
