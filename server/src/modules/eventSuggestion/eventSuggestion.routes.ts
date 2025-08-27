import { Router } from 'express';
import { eventSuggestionController } from './eventSuggestion.controller';
import { authenticateToken } from '../../middleware/authenticate.middleware';
import { validate } from '../pgCommunity/pgCommunity.validation';
import { eventSuggestionValidationSchemas } from './eventSuggestion.validation';

const router = Router();

/**
 * @route GET /api/event-suggestions/target-dates
 * @desc Get target dates for event suggestions (Aug 2, 3, 9)
 * @access Private (Any authenticated user)
 */
router.get(
  '/target-dates',
  authenticateToken,
  eventSuggestionController.getTargetDates
);

/**
 * @route GET /api/event-suggestions/mock-data-stats
 * @desc Get statistics about mock data distribution
 * @access Private (Admin/Owner)
 */
// router.get(
//   '/mock-data-stats',
//   authenticateToken,
//   eventSuggestionController.getMockDataStats
// );

/**
 * @route POST /api/event-suggestions/:pgId/generate
 * @desc Generate AI-powered event suggestions with auto mock data injection
 * @body { eventType?, forceFresh? }
 * @access Private (PG Owner or Resident)
 */
router.post(
  '/:pgId/generate',
  authenticateToken,
  validate(eventSuggestionValidationSchemas.generateSuggestionsSchema),
  eventSuggestionController.generateSuggestions
);

/**
 * @route GET /api/event-suggestions/:pgId
 * @desc Get existing event suggestions with broadcast capability
 * @query status, limit
 * @access Private (PG Owner or Resident)
 */
router.get(
  '/:pgId',
  authenticateToken,
  validate(eventSuggestionValidationSchemas.getSuggestionsSchema),
  eventSuggestionController.getSuggestions
);

/**
 * @route POST /api/event-suggestions/:suggestionId/broadcast
 * @desc Broadcast event suggestion to all residents
 * @body { message?, scheduleFor?, channels? }
 * @access Private (PG Owner only)
 */
router.post(
  '/:suggestionId/broadcast',
  authenticateToken,
  validate(eventSuggestionValidationSchemas.broadcastSuggestionSchema),
  eventSuggestionController.broadcastSuggestion
);

/**
 * @route PATCH /api/event-suggestions/:suggestionId/status
 * @desc Update suggestion status (approve/reject)
 * @body { status, ownerFeedback?, ownerRating? }
 * @access Private (PG Owner)
 */
// router.patch(
//   '/:suggestionId/status',
//   authenticateToken,
//   validate(eventSuggestionValidationSchemas.updateStatusSchema),
//   eventSuggestionController.updateSuggestionStatus
// );

/**
 * @route POST /api/event-suggestions/:suggestionId/implement
 * @desc Implement suggestion as actual event
 * @body { startDate?, endDate?, maxCapacity?, estimatedCost?, facilityId? }
 * @access Private (PG Owner)
 */
router.post(
  '/:suggestionId/implement',
  authenticateToken,
  validate(eventSuggestionValidationSchemas.implementSuggestionSchema),
  eventSuggestionController.implementSuggestion
);

export { router as eventSuggestionRouter };