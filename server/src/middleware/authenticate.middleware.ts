import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import { AppError } from '../utils/errors';

const JWT_SECRET = config.jwtSecret as string;

// Extend Request interface to include user
export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: 'PG_OWNER' | 'RESIDENT';
  };
  [key: string]: any; // allows body, params, query without type checking
}
export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.community_auth_token;

    if (!token) {
      console.log('No token found in cookies');
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      role: 'PG_OWNER' | 'RESIDENT';
      iat: number;
      exp: number;
    };

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError('Invalid token', 401));
    }
    if (error instanceof jwt.TokenExpiredError) {
      return next(new AppError('Token expired', 401));
    }
    next(error);
  }
};

// Role-based authorization middleware
export const requireRole = (allowedRoles: Array<'PG_OWNER' | 'RESIDENT'>) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError('Insufficient permissions', 403));
    }

    next();
  };
};

// PG Owner only middleware
export const requirePgOwner = requireRole(['PG_OWNER']);

// Resident only middleware
export const requireResident = requireRole(['RESIDENT']);

// Middleware to check if user owns the PG community
export const requirePgCommunityOwnership = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    if (req.user.role !== 'PG_OWNER') {
      throw new AppError('Only PG owners can perform this action', 403);
    }

    const { id: pgCommunityId } = req.params;
    if (!pgCommunityId) {
      throw new AppError('PG Community ID is required', 400);
    }

    // Check if the PG community belongs to the authenticated user
    const { prisma } = require('../../lib/prisma');
    const pgCommunity = await prisma.pgCommunity.findUnique({
      where: { id: pgCommunityId },
      select: { ownerId: true }
    });

    if (!pgCommunity) {
      throw new AppError('PG Community not found', 404);
    }

    if (pgCommunity.ownerId !== req.user.userId) {
      throw new AppError('You can only access your own PG communities', 403);
    }

    next();
  } catch (error) {
    next(error);
  }
};

// Middleware to check if user belongs to the PG community (for residents)
export const requirePgCommunityAccess = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const { id: pgCommunityId } = req.params;
    if (!pgCommunityId) {
      throw new AppError('PG Community ID is required', 400);
    }

    const { prisma } = require('../../lib/prisma');

    if (req.user.role === 'PG_OWNER') {
      // Check if PG owner owns this community
      const pgCommunity = await prisma.pgCommunity.findUnique({
        where: { id: pgCommunityId },
        select: { ownerId: true }
      });

      if (!pgCommunity || pgCommunity.ownerId !== req.user.userId) {
        throw new AppError('Access denied to this PG community', 403);
      }
    } else if (req.user.role === 'RESIDENT') {
      // Check if resident belongs to this community
      const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
        select: { pgCommunityId: true }
      });

      if (!user || user.pgCommunityId !== pgCommunityId) {
        throw new AppError('Access denied to this PG community', 403);
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};