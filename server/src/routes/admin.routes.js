
const express = require('express');
const { 
  getSystemSettings, 
  updateSystemSettings, 
  resetDatabase 
} = require('../controllers/admin.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

// All admin routes require admin authentication
router.use(authenticate, authorize(['ADMIN']));

// System settings
router.get('/settings', getSystemSettings);
router.put('/settings', updateSystemSettings);

// Database management
router.post('/reset-database', resetDatabase);

module.exports = router;
