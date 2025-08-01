import { Request, Response, NextFunction } from 'express';
import { eventSuggestionService } from './eventSuggestion.service';
import { mockDataInjectionService } from '../../mockData/mockDataInjectionService';
import { AppError } from '../../utils/errors';
import { ai } from '../../lib/googleGemini';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

class EventSuggestionController {

  /**
   * @route POST /api/event-suggestions/:pgId/generate
   * @desc Generate AI-powered event suggestions with auto mock data injection
   * @access Private (PG Owner or Resident)
   */
  generateSuggestions = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401);
      }

      const { pgId } = req.params;
      const {
        eventType,
        forceFresh = false
      } = req.body;

      if (!ai) {
        throw new AppError('AI service not available', 503);
      }

      const filters = {
        eventType,
        forceFresh: Boolean(forceFresh)
      };

      // Check if suggestions already exist (unless forceFresh is true)
      if (!forceFresh) {
        const existingResult = await eventSuggestionService.getEventSuggestions(
          pgId,
          req.user.userId,
          req.user.role,
        );

        console.log("Checking existing suggestions", existingResult);

        // Fixed condition: return existing suggestions if they exist
        if (existingResult.suggestions && existingResult.suggestions.length > 0) {
          return res.status(200).json({
            success: true,
            message: 'Event suggestions already exist',
            data: existingResult
          });
        }
      }

      // Generate new suggestions if none exist or forceFresh is true
      const result = await eventSuggestionService.generateEventSuggestions(
        pgId,
        req.user.userId,
        req.user.role,
        ai,
        filters
      );

      console.log("Event suggestions generated successfully", result);

      res.status(200).json({
        success: true,
        message: 'Event suggestions generated successfully',
        data: result
      });

    } catch (error) {
      next(error);
    }
  };

  /**
   * @route GET /api/event-suggestions/:pgId
   * @desc Get existing event suggestions with broadcast info
   * @access Private (PG Owner or Resident)
   */
  // Fixed Backend Controller

  /**
   * @route GET /api/event-suggestions/:pgId
   * @desc Get existing event suggestions with broadcast info
   * @access Private (PG Owner or Resident)
   */
  getSuggestions = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401);
      }

      const { pgId } = req.params;
      const {
        status,
        limit = '10',
        autoGenerate = 'true' // Add this parameter to control auto-generation
      } = req.query;

      const filters = {
        status: status as string,
        limit: parseInt(limit as string)
      };

      const result = await eventSuggestionService.getEventSuggestions(
        pgId,
        req.user.userId,
        req.user.role,
        filters
      );

      console.log("Retrieved event suggestions", result);

      // If no suggestions exist and autoGenerate is true, generate them
      if ((!result.suggestions || result.suggestions.length === 0) && autoGenerate === 'true') {
        console.log("No suggestions found, auto-generating...");

        if (!ai) {
          throw new AppError('AI service not available', 503);
        }

        const generatedResult = await eventSuggestionService.generateEventSuggestions(
          pgId,
          req.user.userId,
          req.user.role,
          ai,
          {}
        );

        return res.status(200).json({
          success: true,
          message: 'Event suggestions generated and retrieved successfully',
          data: generatedResult
        });
      }

      res.status(200).json({
        success: true,
        message: 'Event suggestions retrieved successfully',
        data: result.suggestions || [],
        total: result.total || 0
      });

    } catch (error) {
      next(error);
    }
  };


  /**
   * @route POST /api/event-suggestions/:suggestionId/broadcast
   * @desc Broadcast event suggestion to all residents
   * @access Private (PG Owner only)
   */
  broadcastSuggestion = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401);
      }

      if (req.user.role !== 'PG_OWNER') {
        throw new AppError('Only PG owners can broadcast suggestions', 403);
      }

      const { suggestionId } = req.params;
      const {
        message,
        scheduleFor,
        channels = ['email']
      } = req.body;

      const broadcastData = {
        message,
        scheduleFor: scheduleFor ? new Date(scheduleFor) : undefined,
        channels
      };

      const result = await eventSuggestionService.broadcastEventSuggestion(
        suggestionId,
        req.user.userId,
        broadcastData
      );

      res.status(200).json({
        success: true,
        message: 'Event suggestion broadcasted successfully',
        data: result
      });

    } catch (error) {
      next(error);
    }
  };

  /**
   * @route PATCH /api/event-suggestions/:suggestionId/status
   * @desc Update suggestion status (approve/reject)
   * @access Private (PG Owner)
   */
  // updateSuggestionStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  //   try {
  //     if (!req.user) {
  //       throw new AppError('Authentication required', 401);
  //     }

  //     const { suggestionId } = req.params;
  //     const { 
  //       status,
  //       ownerFeedback,
  //       ownerRating 
  //     } = req.body;

  //     if (!['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
  //       throw new AppError('Invalid status value', 400);
  //     }

  //     if (ownerRating && (ownerRating < 1 || ownerRating > 5)) {
  //       throw new AppError('Rating must be between 1 and 5', 400);
  //     }

  //     const updatedSuggestion = await eventSuggestionService.updateSuggestionStatus(
  //       suggestionId,
  //       status,
  //       ownerFeedback,
  //       ownerRating,
  //       req.user.userId
  //     );

  //     res.status(200).json({
  //       success: true,
  //       message: 'Suggestion status updated successfully',
  //       data: updatedSuggestion
  //     });

  //   } catch (error) {
  //     next(error);
  //   }
  // };

  /**
   * @route POST /api/event-suggestions/:suggestionId/implement
   * @desc Implement suggestion as actual event
   * @access Private (PG Owner)
   */
  implementSuggestion = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401);
      }

      if (req.user.role !== 'PG_OWNER') {
        throw new AppError('Only PG owners can implement suggestions', 403);
      }

      const { suggestionId } = req.params;
      const {
        startDate,
        endDate,
        maxCapacity,
        estimatedCost,
        facilityId
      } = req.body;

      const eventDetails = {
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        maxCapacity: maxCapacity ? parseInt(maxCapacity) : undefined,
        estimatedCost: estimatedCost ? parseFloat(estimatedCost) : undefined,
        facilityId
      };

      // Validate dates if provided
      if (eventDetails.startDate && eventDetails.endDate) {
        if (eventDetails.startDate >= eventDetails.endDate) {
          throw new AppError('End date must be after start date', 400);
        }

        if (eventDetails.startDate < new Date()) {
          throw new AppError('Event date cannot be in the past', 400);
        }
      }

      const event = await eventSuggestionService.implementSuggestion(
        suggestionId,
        eventDetails,
        req.user.userId
      );

      res.status(201).json({
        success: true,
        message: 'Event created successfully from suggestion',
        data: event
      });

    } catch (error) {
      next(error);
    }
  };

  /**
   * @route GET /api/event-suggestions/:pgId/mock-data-info
   * @desc Get information about injected mock data
   * @access Private (PG Owner or Resident)
   */
  getMockDataInfo = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401);
      }

      const { pgId } = req.params;

      const mockDataInfo = await mockDataInjectionService.getMockDataInfo(pgId);
      const hasMockData = await mockDataInjectionService.hasMockData(pgId);

      res.status(200).json({
        success: true,
        message: 'Mock data information retrieved successfully',
        data: {
          hasMockData,
          mockDataInfo,
          isFirstTime: !hasMockData
        }
      });

    } catch (error) {
      next(error);
    }
  };

  /**
   * @route GET /api/event-suggestions/target-dates
   * @desc Get target dates for event suggestions
   * @access Private (Any authenticated user)
   */
  getTargetDates = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401);
      }

      const { getTargetDates } = await import('../../mockData/eventsMockData');
      const targetDates = getTargetDates();

      res.status(200).json({
        success: true,
        message: 'Target dates retrieved successfully',
        data: targetDates
      });

    } catch (error) {
      next(error);
    }
  };

  /**
   * @route GET /api/event-suggestions/mock-data-stats
   * @desc Get statistics about mock data distribution (Admin only)
   * @access Private (Admin)
   */
  // getMockDataStats = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  //   try {
  //     if (!req.user) {
  //       throw new AppError('Authentication required', 401);
  //     }

  //     // In a real app, you'd check for admin role here
  //     const stats = await mockDataInjectionService.getMockDataStats();

  //     res.status(200).json({
  //       success: true,
  //       message: 'Mock data statistics retrieved successfully',
  //       data: stats
  //     });

  //   } catch (error) {
  //     next(error);
  //   }
  // };

  /**
   * @route DELETE /api/event-suggestions/:pgId/mock-data
   * @desc Clear mock data for a PG (Testing purposes)
   * @access Private (PG Owner)
   */
  clearMockData = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401);
      }

      if (req.user.role !== 'PG_OWNER') {
        throw new AppError('Only PG owners can clear mock data', 403);
      }

      const { pgId } = req.params;

      await mockDataInjectionService.clearMockData(pgId);

      res.status(200).json({
        success: true,
        message: 'Mock data cleared successfully'
      });

    } catch (error) {
      next(error);
    }
  };

  /**
   * @route POST /api/event-suggestions/:pgId/force-inject
   * @desc Force inject mock data (Testing purposes)
   * @access Private (PG Owner)
   */
  forceInjectMockData = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401);
      }

      if (req.user.role !== 'PG_OWNER') {
        throw new AppError('Only PG owners can force inject mock data', 403);
      }

      const { pgId } = req.params;

      // Clear existing mock data first
      try {
        await mockDataInjectionService.clearMockData(pgId);
      } catch (error) {
        // Ignore if no mock data exists
      }

      // Inject fresh mock data
      await mockDataInjectionService.injectMockDataToPg(pgId);

      const mockDataInfo = await mockDataInjectionService.getMockDataInfo(pgId);

      res.status(200).json({
        success: true,
        message: 'Mock data injected successfully',
        data: mockDataInfo
      });

    } catch (error) {
      next(error);
    }
  };
}

export const eventSuggestionController = new EventSuggestionController();