import { Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../types';
import { AppError } from '../middleware/errorHandler';
import * as UserModel from '../models/User';

const generateToken = (userId: string, email: string, role: string): string => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET not configured');
  }

  return jwt.sign({ id: userId, email, role }, jwtSecret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  } as jwt.SignOptions);
};

// ========================================
// CONTROLLER FUNCTIONS
// ========================================

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public (but typically called by admin/manager)
 */
export const register = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, first_name, last_name, role } = req.body;

    // Check if user already exists
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      throw new AppError('User with this email already exists', 400);
    }

    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Create user
    const newUser = await UserModel.create({
      email,
      password_hash,
      first_name,
      last_name,
      role,
    });

    // Generate token
    const token = generateToken(newUser.id, newUser.email, newUser.role);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          role: newUser.role,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
export const login = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    // Generate token
    const token = generateToken(user.id, user.email, user.role);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client-side token removal)
 * @access  Protected
 */
export const logout = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // With JWT, logout is handled client-side by removing token
    // You could implement token blacklisting here if needed

    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get current user info
 * @access  Protected
 */
export const getCurrentUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    // Get full user details from database
    const user = await UserModel.findById(req.user.id);
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
 * @route   PUT /api/auth/profile
 * @desc    Update current user's profile
 * @access  Protected
 */
export const updateProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    const { first_name, last_name, email, current_password, new_password } =
      req.body;

    // Get current user
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Prepare update data
    const updates: Partial<UserModel.UpdateUserData> = {};

    if (first_name !== undefined) updates.first_name = first_name;
    if (last_name !== undefined) updates.last_name = last_name;

    // Email change requires verification of current password
    if (email && email !== user.email) {
      if (!current_password) {
        throw new AppError('Current password required to change email', 400);
      }

      const isPasswordValid = await bcrypt.compare(
        current_password,
        user.password_hash
      );
      if (!isPasswordValid) {
        throw new AppError('Current password is incorrect', 401);
      }

      // Check if new email is already in use
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser && existingUser.id !== user.id) {
        throw new AppError('Email already in use', 400);
      }

      updates.email = email;
    }

    // Password change
    if (new_password) {
      if (!current_password) {
        throw new AppError('Current password required to change password', 400);
      }

      const isPasswordValid = await bcrypt.compare(
        current_password,
        user.password_hash
      );
      if (!isPasswordValid) {
        throw new AppError('Current password is incorrect', 401);
      }

      // Hash new password
      const saltRounds = 10;
      updates.password_hash = await bcrypt.hash(new_password, saltRounds);
    }

    // Update user
    const updatedUser = await UserModel.update(req.user.id, updates);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: updatedUser.id,
        email: updatedUser.email,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        role: updatedUser.role,
        updated_at: updatedUser.updated_at,
      },
    });
  } catch (error) {
    next(error);
  }
};
