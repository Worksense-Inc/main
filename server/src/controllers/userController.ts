import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { AppError } from '../middleware/errorHandler';

// ========================================
// PLACEHOLDER DATABASE FUNCTIONS
// TODO: Replace with Jorge's User model functions
// ========================================
const db = {
  async findAllUsers(): Promise<any[]> {
    // TODO: Jorge will provide this query
    // Should return array of user objects
    throw new Error('Database function not implemented');
  },

  async findUserById(id: string): Promise<any | null> {
    // TODO: Jorge will provide this query
    // Should return user object or null
    throw new Error('Database function not implemented');
  },

  async updateUser(id: string, userData: any): Promise<any> {
    // TODO: Jorge will provide this query
    // Should return updated user object
    throw new Error('Database function not implemented');
  },

  async deleteUser(id: string): Promise<boolean> {
    // TODO: Jorge will provide this query
    // Should return success boolean
    throw new Error('Database function not implemented');
  }
};

// ========================================
// CONTROLLER FUNCTIONS
// ========================================

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Protected (Employee level)
 */
export const getAllUsers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await db.findAllUsers();

    res.status(200).json({
      success: true,
      data: users.map((user: any) => ({
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        created_at: user.created_at,
      })),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Protected (Employee level)
 */
export const getUserById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const user = await db.findUserById(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/users/:id
 * @desc    Update user
 * @access  Protected (Manager level)
 */
export const updateUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate user exists
    const existingUser = await db.findUserById(id);
    if (!existingUser) {
      throw new AppError('User not found', 404);
    }

    // Update user
    const updatedUser = await db.updateUser(id, updateData);

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: {
        id: updatedUser.id,
        email: updatedUser.email,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user
 * @access  Protected (Manager level)
 */
export const deleteUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // Validate user exists
    const existingUser = await db.findUserById(id);
    if (!existingUser) {
      throw new AppError('User not found', 404);
    }

    // Prevent self-deletion
    if (req.user?.id === id) {
      throw new AppError('Cannot delete your own account', 400);
    }

    await db.deleteUser(id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
