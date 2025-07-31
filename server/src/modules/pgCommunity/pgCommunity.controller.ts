import { Request, Response, NextFunction } from 'express';
import { pgCommunityService } from '../pgCommunity/pgCommunity.service';
import { AppError } from '../../utils/errors';
import { AuthenticatedRequest } from '@/middleware/authenticate.middleware';

export const pgCommunityController = {
  // Create a new PG community
  async createPgCommunity(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401);
      }

      if (req.user.role !== 'PG_OWNER') {
        throw new AppError('Only PG owners can create communities', 403);
      }

      const { name, address, description } = req.body;

      const pgCommunity = await pgCommunityService.createPgCommunity({
        name,
        address,
        description,
        ownerId: req.user.userId 
      });

      res.status(201).json({
        success: true,
        message: 'PG Community created successfully',
        data: pgCommunity
      });
    } catch (error) {
      next(error);
    }
  },

  // Get all PG communities for the authenticated owner
  async getMyPgCommunities(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401);
      }

      if (req.user.role !== 'PG_OWNER') {
        throw new AppError('Only PG owners can view their communities', 403);
      }

      const pgCommunities = await pgCommunityService.getPgCommunitiesByOwner(req.user?.userId as string);

      res.status(200).json({
        success: true,
        message: 'PG Communities retrieved successfully',
        data: pgCommunities,
        count: pgCommunities.length
      });
    } catch (error) {
      next(error);
    }
  },

  // Get a specific PG community by ID
  async getPgCommunityById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401);
      }

      const { id } = req.params;

      const pgCommunity = await pgCommunityService.getPgCommunityById(id, req.user?.userId as string);

      res.status(200).json({
        success: true,
        message: 'PG Community retrieved successfully',
        data: pgCommunity
      });
    } catch (error) {
      next(error);
    }
  },

  // Get PG community by pgCode (public route for residents during signup)
  async getPgCommunityByCode(req: Request, res: Response, next: NextFunction) {
    try {
      const { pgCode } = req.params;

      const pgCommunity = await pgCommunityService.getPgCommunityByCode(pgCode);

      res.status(200).json({
        success: true,
        message: 'PG Community found',
        data: pgCommunity
      });
    } catch (error) {
      next(error);
    }
  },

  // Update a PG community
  async updatePgCommunity(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401);
      }

      if (req.user.role !== 'PG_OWNER') {
        throw new AppError('Only PG owners can update communities', 403);
      }

      const { id } = req.params;
      const { name, address, description } = req.body;

      const updatedPgCommunity = await pgCommunityService.updatePgCommunity(
        id,
        { name, address, description },
        req.user?.userId as string
      );

      res.status(200).json({
        success: true,
        message: 'PG Community updated successfully',
        data: updatedPgCommunity
      });
    } catch (error) {
      next(error);
    }
  },

  // Delete a PG community
  async deletePgCommunity(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401);
      }

      if (req.user.role !== 'PG_OWNER') {
        throw new AppError('Only PG owners can delete communities', 403);
      }

      const { id } = req.params;

      const result = await pgCommunityService.deletePgCommunity(id, req.user?.userId as string);

      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  },

  // Get PG community statistics
  async getPgCommunityStats(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401);
      }

      if (req.user.role !== 'PG_OWNER') {
        throw new AppError('Only PG owners can view community statistics', 403);
      }

      const { id } = req.params;

      const stats = await pgCommunityService.getPgCommunityStats(id, req.user?.userId as string);

      res.status(200).json({
        success: true,
        message: 'PG Community statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      next(error);
    }
  },

  // Search PG communities (admin/public route)
  async searchPgCommunities(req: Request, res: Response, next: NextFunction) {
    try {
      const { q: query, limit } = req.query;

      if (!query || typeof query !== 'string') {
        throw new AppError('Search query is required', 400);
      }

      const limitNum = limit ? parseInt(limit as string, 10) : 10;

      if (limitNum > 50) {
        throw new AppError('Limit cannot exceed 50', 400);
      }

      const pgCommunities = await pgCommunityService.searchPgCommunities(query, limitNum);

      res.status(200).json({
        success: true,
        message: 'Search results retrieved successfully',
        data: pgCommunities,
        count: pgCommunities.length
      });
    } catch (error) {
      next(error);
    }
  },

  // Get PG community residents (owner only)
  async getPgCommunityResidents(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401);
      }

      if (req.user.role !== 'PG_OWNER') {
        throw new AppError('Only PG owners can view residents', 403);
      }

      const { id } = req.params;

      // Get PG community with residents
      const pgCommunity = await pgCommunityService.getPgCommunityById(id, req.user?.userId as string);

      res.status(200).json({
        success: true,
        message: 'Residents retrieved successfully',
        data: {
          pgCommunity: {
            id: pgCommunity.id,
            name: pgCommunity.name,
            pgCode: pgCommunity.pgCode
          },
          residents: pgCommunity.residents,
          count: pgCommunity.residents.length
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // Get resident's PG community info
  async getMyPgCommunity(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401);
      }

      if (req.user.role !== 'RESIDENT') {
        throw new AppError('Only residents can view their PG community', 403);
      }

      // Get user's PG community ID
      const user = await require('../../lib/prisma').prisma.user.findUnique({
        where: { id: req.user?.userId as string },
        select: { pgCommunityId: true }
      });

      if (!user?.pgCommunityId) {
        throw new AppError('You are not associated with any PG community', 404);
      }

      const pgCommunity = await pgCommunityService.getPgCommunityById(
        user.pgCommunityId,
        req.user?.userId as string
      );

      res.status(200).json({
        success: true,
        message: 'Your PG Community retrieved successfully',
        data: pgCommunity
      });
    } catch (error) {
      next(error);
    }
  }
};