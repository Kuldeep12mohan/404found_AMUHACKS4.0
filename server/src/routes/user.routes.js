
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize } = require('../middleware/auth.middleware');

const prisma = new PrismaClient();
const router = express.Router();

// Admin: Get all users
router.get('/', authenticate, authorize(['ADMIN']), async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        points: true,
        createdAt: true,
        _count: {
          select: {
            pickupRequests: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    res.status(200).json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Failed to get users', error: error.message });
  }
});

// Admin: Update user role
router.patch('/:id/role', authenticate, authorize(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });
    
    res.status(200).json({
      message: 'User role updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ message: 'Failed to update user role', error: error.message });
  }
});

// Admin: Adjust user points
router.patch('/:id/points', authenticate, authorize(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    const { points, operation } = req.body;
    
    let updateData = {};
    
    if (operation === 'add') {
      updateData = {
        points: {
          increment: points
        }
      };
    } else if (operation === 'subtract') {
      updateData = {
        points: {
          decrement: points
        }
      };
    } else {
      updateData = { points };
    }
    
    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        points: true
      }
    });
    
    res.status(200).json({
      message: 'User points updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user points error:', error);
    res.status(500).json({ message: 'Failed to update user points', error: error.message });
  }
});

module.exports = router;
