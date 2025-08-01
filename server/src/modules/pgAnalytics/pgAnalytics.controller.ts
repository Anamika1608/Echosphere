import { Request, Response, NextFunction } from 'express';
import { pgCommunityAnalyticsService } from './pgAnalytics.services';
import { AppError } from '../../utils/errors';
import { AuthenticatedRequest } from '@/middleware/authenticate.middleware';

export const pgCommunityAnalyticsController = {
  // Get user's raised issues
  async getUserRaisedIssues(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401);
      }

      const { 
        page = '1', 
        limit = '10', 
        status, 
        priority, 
        issueType,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      const filters = {
        status: status as string,
        priority: priority as string,
        issueType: issueType as string,
      };

      const pagination = {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc'
      };

      const result = await pgCommunityAnalyticsService.getUserRaisedIssues(
        req.user.userId,
        filters,
        pagination
      );

      res.status(200).json({
        success: true,
        message: 'User issues retrieved successfully',
        data: result.issues,
        pagination: result.pagination,
        summary: result.summary
      });
    } catch (error) {
      next(error);
    }
  },

  // Get user's requested services
  async getUserRequestedServices(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401);
      }

      const { 
        page = '1', 
        limit = '10', 
        status, 
        priority, 
        serviceType,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      const filters = {
        status: status as string,
        priority: priority as string,
        serviceType: serviceType as string,
      };

      const pagination = {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc'
      };

      const result = await pgCommunityAnalyticsService.getUserRequestedServices(
        req.user.userId,
        filters,
        pagination
      );

      res.status(200).json({
        success: true,
        message: 'User services retrieved successfully',
        data: result.services,
        pagination: result.pagination,
        summary: result.summary
      });
    } catch (error) {
      next(error);
    }
  },

  // Get user's attended events
  async getUserAttendedEvents(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401);
      }

      const { 
        page = '1', 
        limit = '10', 
        eventType,
        upcoming = 'false',
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      const filters = {
        eventType: eventType as string,
        upcoming: upcoming === 'true',
      };

      const pagination = {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc'
      };

      const result = await pgCommunityAnalyticsService.getUserAttendedEvents(
        req.user.userId,
        filters,
        pagination
      );

      res.status(200).json({
        success: true,
        message: 'User events retrieved successfully',
        data: result.events,
        pagination: result.pagination,
        summary: result.summary
      });
    } catch (error) {
      next(error);
    }
  },

  // Get user dashboard overview
  async getUserDashboardOverview(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401);
      }

      const overview = await pgCommunityAnalyticsService.getUserDashboardOverview(
        req.user.userId
      );

      res.status(200).json({
        success: true,
        message: 'User dashboard overview retrieved successfully',
        data: overview
      });
    } catch (error) {
      next(error);
    }
  },

  // Get user's recent activities
  async getUserRecentActivities(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401);
      }

      const { limit = '20' } = req.query;

      const activities = await pgCommunityAnalyticsService.getUserRecentActivities(
        req.user.userId,
        parseInt(limit as string)
      );

      res.status(200).json({
        success: true,
        message: 'User recent activities retrieved successfully',
        data: activities
      });
    } catch (error) {
      next(error);
    }
  },

  // Get all raised issues for a specific PG community
  async getPgCommunityIssues(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401);
      }

      const { id } = req.params;
      const { 
        page = '1', 
        limit = '10', 
        status, 
        priority, 
        issueType,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      const filters = {
        status: status as string,
        priority: priority as string,
        issueType: issueType as string,
      };

      const pagination = {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc'
      };

      const result = await pgCommunityAnalyticsService.getPgCommunityIssues(
        id, 
        req.user.userId, 
        req.user.role,
        filters,
        pagination
      );

      res.status(200).json({
        success: true,
        message: 'Issues retrieved successfully',
        data: result.issues,
        pagination: result.pagination,
        summary: result.summary
      });
    } catch (error) {
      next(error);
    }
  },

  // Get all requested services for a specific PG community
  async getPgCommunityServices(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401);
      }

      const { id } = req.params;
      const { 
        page = '1', 
        limit = '10', 
        status, 
        priority, 
        serviceType,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      const filters = {
        status: status as string,
        priority: priority as string,
        serviceType: serviceType as string,
      };

      const pagination = {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc'
      };

      const result = await pgCommunityAnalyticsService.getPgCommunityServices(
        id, 
        req.user.userId, 
        req.user.role,
        filters,
        pagination
      );

      res.status(200).json({
        success: true,
        message: 'Services retrieved successfully',
        data: result.services,
        pagination: result.pagination,
        summary: result.summary
      });
    } catch (error) {
      next(error);
    }
  },

  // Get all events for a specific PG community
  async getPgCommunityEvents(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401);
      }

      const { id } = req.params;
      const { 
        page = '1', 
        limit = '10', 
        eventType,
        upcoming = 'false',
        sortBy = 'startDate',
        sortOrder = 'desc'
      } = req.query;

      const filters = {
        eventType: eventType as string,
        upcoming: upcoming === 'true',
      };

      const pagination = {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc'
      };

      

      const result = await pgCommunityAnalyticsService.getPgCommunityEvents(
        id, 
        req.user.userId, 
        req.user.role,
        filters,
        pagination
      );

      res.status(200).json({
        success: true,
        message: 'Events retrieved successfully',
        data: result.events,
        pagination: result.pagination,
        summary: result.summary
      });
    } catch (error) {
      next(error);
    }
  },

  // Get comprehensive analytics for a PG community
  async getPgCommunityAnalytics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401);
      }

      const { id } = req.params;
      const { timeframe = '30' } = req.query; // days

      const analytics = await pgCommunityAnalyticsService.getPgCommunityAnalytics(
        id, 
        req.user.userId, 
        req.user.role,
        parseInt(timeframe as string)
      );

      res.status(200).json({
        success: true,
        message: 'Analytics retrieved successfully',
        data: analytics
      });
    } catch (error) {
      next(error);
    }
  },

  // Get event analytics for a specific PG community
  async getEventAnalytics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401);
      }

      const { id } = req.params;
      const { timeframe = '30' } = req.query; // days

      const eventAnalytics = await pgCommunityAnalyticsService.getEventAnalytics(
        id, 
        req.user.userId, 
        req.user.role,
        parseInt(timeframe as string)
      );

      res.status(200).json({
        success: true,
        message: 'Event analytics retrieved successfully',
        data: eventAnalytics
      });
    } catch (error) {
      next(error);
    }
  },

  // Get dashboard overview for a PG community
  async getDashboardOverview(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401);
      }

      const { id } = req.params;

      const overview = await pgCommunityAnalyticsService.getDashboardOverview(
        id, 
        req.user.userId, 
        req.user.role
      );

      res.status(200).json({
        success: true,
        message: 'Dashboard overview retrieved successfully',
        data: overview
      });
    } catch (error) {
      next(error);
    }
  },

  // Get recent activities for a PG community
  async getRecentActivities(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401);
      }

      const { id } = req.params;
      const { limit = '20' } = req.query;

      const activities = await pgCommunityAnalyticsService.getRecentActivities(
        id, 
        req.user.userId, 
        req.user.role,
        parseInt(limit as string)
      );

      res.status(200).json({
        success: true,
        message: 'Recent activities retrieved successfully',
        data: activities
      });
    } catch (error) {
      next(error);
    }
  }
};