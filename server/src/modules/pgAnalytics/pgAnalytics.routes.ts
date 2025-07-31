import { Router } from 'express';
import { pgCommunityAnalyticsController } from '../pgAnalytics/pgAnalytics.controller';
import { 
  getPgCommunityByIdSchema,
  validate 
} from '../pgCommunity/pgCommunity.validation';
import { authenticateToken } from '../../middleware/authenticate.middleware';

const router = Router();

/**
 * @route GET /api/pg-community/:id/dashboard
 * @desc Get dashboard overview for a PG community
 * @access Private (Owner or Resident of that community)
 */
router.get(
  '/:id/dashboard',
  authenticateToken,
  validate(getPgCommunityByIdSchema),
  pgCommunityAnalyticsController.getDashboardOverview
);

/**
 * @route GET /api/pg-community/:id/issues
 * @desc Get all raised issues for a PG community with filters and pagination
 * @query page, limit, status, priority, issueType, sortBy, sortOrder
 * @access Private (Owner or Resident of that community)
 */
router.get(
  '/:id/issues',
  authenticateToken,
  validate(getPgCommunityByIdSchema),
  pgCommunityAnalyticsController.getPgCommunityIssues
);

/**
 * @route GET /api/pg-community/:id/services
 * @desc Get all requested services for a PG community with filters and pagination
 * @query page, limit, status, priority, serviceType, sortBy, sortOrder
 * @access Private (Owner or Resident of that community)
 */
router.get(
  '/:id/services',
  authenticateToken,
  validate(getPgCommunityByIdSchema),
  pgCommunityAnalyticsController.getPgCommunityServices
);

/**
 * @route GET /api/pg-community/:id/events
 * @desc Get all events for a PG community with filters and pagination
 * @query page, limit, eventType, upcoming, sortBy, sortOrder
 * @access Private (Owner or Resident of that community)
 */
router.get(
  '/:id/events',
  authenticateToken,
  validate(getPgCommunityByIdSchema),
  pgCommunityAnalyticsController.getPgCommunityEvents
);

/**
 * @route GET /api/pg-community/:id/analytics
 * @desc Get comprehensive analytics for a PG community
 * @query timeframe (days, default: 30)
 * @access Private (Owner or Resident of that community)
 */
router.get(
  '/:id/analytics',
  authenticateToken,
  validate(getPgCommunityByIdSchema),
  pgCommunityAnalyticsController.getPgCommunityAnalytics
);

/**
 * @route GET /api/pg-community/:id/event-analytics
 * @desc Get event-specific analytics for a PG community
 * @query timeframe (days, default: 30)
 * @access Private (Owner or Resident of that community)
 */
router.get(
  '/:id/event-analytics',
  authenticateToken,
  validate(getPgCommunityByIdSchema),
  pgCommunityAnalyticsController.getEventAnalytics
);

/**
 * @route GET /api/pg-community/:id/activities
 * @desc Get recent activities for a PG community
 * @query limit (default: 20)
 * @access Private (Owner or Resident of that community)
 */
router.get(
  '/:id/activities',
  authenticateToken,
  validate(getPgCommunityByIdSchema),
  pgCommunityAnalyticsController.getRecentActivities
);

export { router as pgAnalyticsRouter };