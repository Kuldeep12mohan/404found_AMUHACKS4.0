
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Get system settings
const getSystemSettings = async (req, res) => {
  try {
    // In a real implementation, this would fetch settings from the database
    // For now, return mock settings
    
    const settings = {
      general: {
        siteName: 'Smart Waste Management',
        contactEmail: 'contact@smartwaste.example.com',
        supportPhone: '+1-555-123-4567',
        maintenanceMode: false
      },
      notifications: {
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        reminderHours: 24
      },
      security: {
        sessionTimeout: 60,
        passwordExpiryDays: 90,
        twoFactorAuth: false,
        loginAttempts: 5
      },
      pickup: {
        maxRequestsPerUser: 5,
        defaultPointsPerPickup: 10,
        approvalRequired: true,
        allowedFileTypes: ['jpg', 'jpeg', 'png'],
        maxFileSize: 5
      }
    };
    
    res.status(200).json({ settings });
  } catch (error) {
    console.error('Get system settings error:', error);
    res.status(500).json({ 
      message: 'Failed to get system settings', 
      error: error.message 
    });
  }
};

// Update system settings
const updateSystemSettings = async (req, res) => {
  try {
    const { settings } = req.body;
    
    // In a real implementation, this would update settings in the database
    // For now, just return the received settings
    
    res.status(200).json({ 
      message: 'Settings updated successfully',
      settings 
    });
  } catch (error) {
    console.error('Update system settings error:', error);
    res.status(500).json({ 
      message: 'Failed to update system settings', 
      error: error.message 
    });
  }
};

// Reset database and load sample data
const resetDatabase = async (req, res) => {
  try {
    // Delete all existing records from tables
    await prisma.pickupRequest.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.recyclingCenter.deleteMany({});
    await prisma.binStatus.deleteMany({});
    await prisma.collectionSchedule.deleteMany({});
    
    // Run the seed script to reload sample data
    // In a real app, you'd want to be more careful with this operation
    const seedPath = path.join(__dirname, '..', '..', 'prisma', 'seed.js');
    
    // Execute the seed file
    require(seedPath);
    
    res.status(200).json({ 
      message: 'Database reset successfully. Sample data has been loaded.' 
    });
  } catch (error) {
    console.error('Reset database error:', error);
    res.status(500).json({ 
      message: 'Failed to reset database', 
      error: error.message 
    });
  }
};

module.exports = {
  getSystemSettings,
  updateSystemSettings,
  resetDatabase
};
