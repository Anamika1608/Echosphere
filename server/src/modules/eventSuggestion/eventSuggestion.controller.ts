// @ts-nocheck

import { Request, Response, NextFunction } from 'express';
import { eventSuggestionService } from './eventSuggestion.service';
import { AppError } from '../../utils/errors';
import { ai } from '../../lib/googleGemini';
import { getTargetDates } from './targetDates';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

class EventSuggestionController {

  /**
   * @route POST /api/event-suggestions/:pgId/generate
   * @desc Generate AI-powered event suggestions based on current date and upcoming occasions
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

        // Return existing suggestions if they exist
        if (existingResult.suggestions && existingResult.suggestions.length > 0) {
          return res.status(200).json({
            success: true,
            message: 'Event suggestions already exist',
            data: existingResult
          });
        }
      }

      // Generate new suggestions
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
   * @desc Get existing event suggestions with auto-generation if none exist
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
        autoGenerate = 'true'
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
        console.log("No suggestions found, auto-generating based on current date...");

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
   * @route GET /api/event-suggestions/target-dates
   * @desc Get target dates for event suggestions based on current date
   * @access Private (Any authenticated user)
   */
  getTargetDates = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401);
      }

      const targetDates = getTargetDates();

      res.status(200).json({
        success: true,
        message: 'Target dates retrieved successfully',
        data: targetDates,
        currentDate: new Date().toISOString()
      });

    } catch (error) {
      next(error);
    }
  };

  /**
   * @route POST /api/event-suggestions/:pgId/refresh
   * @desc Force refresh suggestions based on current date
   * @access Private (PG Owner)
   */
  refreshSuggestions = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401);
      }

      if (req.user.role !== 'PG_OWNER') {
        throw new AppError('Only PG owners can refresh suggestions', 403);
      }

      const { pgId } = req.params;

      if (!ai) {
        throw new AppError('AI service not available', 503);
      }

      // Force generate fresh suggestions
      const result = await eventSuggestionService.generateEventSuggestions(
        pgId,
        req.user.userId,
        req.user.role,
        ai,
        { forceFresh: true }
      );

      res.status(200).json({
        success: true,
        message: 'Event suggestions refreshed successfully',
        data: result
      });

    } catch (error) {
      next(error);
    }
  };

  /**
   * @route GET /api/event-suggestions/:pgId/status
   * @desc Get status of event suggestions for a PG
   * @access Private (PG Owner or Resident)
   */
  getSuggestionStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401);
      }

      const { pgId } = req.params;

      const result = await eventSuggestionService.getEventSuggestions(
        pgId,
        req.user.userId,
        req.user.role,
        { limit: 1 }
      );

      const targetDates = getTargetDates();

      res.status(200).json({
        success: true,
        message: 'Suggestion status retrieved successfully',
        data: {
          hasSuggestions: result.suggestions && result.suggestions.length > 0,
          totalSuggestions: result.total,
          latestSuggestion: result.suggestions?.[0] || null,
          nextTargetDates: targetDates,
          currentDate: new Date().toISOString()
        }
      });

    } catch (error) {
      next(error);
    }
  };
}

export const eventSuggestionController = new EventSuggestionController();