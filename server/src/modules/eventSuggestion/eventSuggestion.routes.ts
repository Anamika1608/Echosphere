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

/**
 * @route GET /api/event-suggestions/:pgId/mock-data-info
 * @desc Get information about injected mock data
 * @access Private (PG Owner or Resident)
 */
router.get(
  '/:pgId/mock-data-info',
  authenticateToken,
  validate(eventSuggestionValidationSchemas.getPgInfoSchema),
  eventSuggestionController.getMockDataInfo
);

/**
 * @route DELETE /api/event-suggestions/:pgId/mock-data
 * @desc Clear mock data for a PG (Testing purposes)
 * @access Private (PG Owner)
 */
router.delete(
  '/:pgId/mock-data',
  authenticateToken,
  validate(eventSuggestionValidationSchemas.getPgInfoSchema),
  eventSuggestionController.clearMockData
);

/**
 * @route POST /api/event-suggestions/:pgId/force-inject
 * @desc Force inject mock data (Testing purposes)
 * @access Private (PG Owner)
 */
router.post(
  '/:pgId/force-inject',
  authenticateToken,
  validate(eventSuggestionValidationSchemas.getPgInfoSchema),
  eventSuggestionController.forceInjectMockData
);

export { router as eventSuggestionRouter };