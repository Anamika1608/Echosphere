import { Router } from 'express';
import { pgCommunityAnalyticsController } from '../pgAnalytics/pgAnalytics.controller';
import { 
  getPgCommunityByIdSchema,
  validate 
} from '../pgCommunity/pgCommunity.validation';
import { analyticsValidationSchemas } from './pgAnalytics.validation';
import { authenticateToken } from '../../middleware/authenticate.middleware';

const router = Router();

// User-specific routes (for user dashboard)
/**
 * @route GET /api/pg-analytics/user/dashboard
 * @desc Get user dashboard overview with personal stats
 * @access Private (Any authenticated user)
 */
router.get(
  '/user/dashboard',
  authenticateToken,
  pgCommunityAnalyticsController.getUserDashboardOverview
);

/**
 * @route GET /api/pg-analytics/user/issues
 * @desc Get user's raised issues with filters and pagination
 * @query page, limit, status, priority, issueType, sortBy, sortOrder
 * @access Private (Any authenticated user)
 */
router.get(
  '/user/issues',
  authenticateToken,
  validate(analyticsValidationSchemas.getPgIssuesSchema.omit({ params: true })),
  pgCommunityAnalyticsController.getUserRaisedIssues
);

/**
 * @route GET /api/pg-analytics/user/services
 * @desc Get user's requested services with filters and pagination
 * @query page, limit, status, priority, serviceType, sortBy, sortOrder
 * @access Private (Any authenticated user)
 */
router.get(
  '/user/services',
  authenticateToken,
  validate(analyticsValidationSchemas.getPgServicesSchema.omit({ params: true })),
  pgCommunityAnalyticsController.getUserRequestedServices
);

/**
 * @route GET /api/pg-analytics/user/events
 * @desc Get user's attended events with filters and pagination
 * @query page, limit, eventType, upcoming, sortBy, sortOrder
 * @access Private (Any authenticated user)
 */
router.get(
  '/user/events',
  authenticateToken,
  validate(analyticsValidationSchemas.getPgEventsSchema.omit({ params: true })),
  pgCommunityAnalyticsController.getUserAttendedEvents
);

/**
 * @route GET /api/pg-analytics/user/activities
 * @desc Get user's recent activities
 * @query limit (default: 20)
 * @access Private (Any authenticated user)
 */
router.get(
  '/user/activities',
  authenticateToken,
  validate(analyticsValidationSchemas.getRecentActivitiesSchema.omit({ params: true })),
  pgCommunityAnalyticsController.getUserRecentActivities
);

// PG Community-specific routes (for PG owners and residents)
/**
 * @route GET /api/pg-analytics/:id/dashboard
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
 * @route GET /api/pg-analytics/:id/issues
 * @desc Get all raised issues for a PG community with filters and pagination
 * @query page, limit, status, priority, issueType, sortBy, sortOrder
 * @access Private (Owner or Resident of that community)
 */
router.get(
  '/:id/issues',
  authenticateToken,
  validate(analyticsValidationSchemas.getPgIssuesSchema),
  pgCommunityAnalyticsController.getPgCommunityIssues
);

/**
 * @route GET /api/pg-analytics/:id/services
 * @desc Get all requested services for a PG community with filters and pagination
 * @query page, limit, status, priority, serviceType, sortBy, sortOrder
 * @access Private (Owner or Resident of that community)
 */
router.get(
  '/:id/services',
  authenticateToken,
  validate(analyticsValidationSchemas.getPgServicesSchema),
  pgCommunityAnalyticsController.getPgCommunityServices
);

/**
 * @route GET /api/pg-analytics/:id/events
 * @desc Get all events for a PG community with filters and pagination
 * @query page, limit, eventType, upcoming, sortBy, sortOrder
 * @access Private (Owner or Resident of that community)
 */
router.get(
  '/:id/events',
  authenticateToken,
  validate(analyticsValidationSchemas.getPgEventsSchema),
  pgCommunityAnalyticsController.getPgCommunityEvents
);

/**
 * @route GET /api/pg-analytics/:id/analytics
 * @desc Get comprehensive analytics for a PG community
 * @query timeframe (days, default: 30)
 * @access Private (Owner or Resident of that community)
 */
router.get(
  '/:id/analytics',
  authenticateToken,
  validate(analyticsValidationSchemas.getPgAnalyticsSchema),
  pgCommunityAnalyticsController.getPgCommunityAnalytics
);

/**
 * @route GET /api/pg-analytics/:id/event-analytics
 * @desc Get event-specific analytics for a PG community
 * @query timeframe (days, default: 30)
 * @access Private (Owner or Resident of that community)
 */
router.get(
  '/:id/event-analytics',
  authenticateToken,
  validate(analyticsValidationSchemas.getPgAnalyticsSchema),
  pgCommunityAnalyticsController.getEventAnalytics
);

/**
 * @route GET /api/pg-analytics/:id/activities
 * @desc Get recent activities for a PG community
 * @query limit (default: 20)
 * @access Private (Owner or Resident of that community)
 */
router.get(
  '/:id/activities',
  authenticateToken,
  validate(analyticsValidationSchemas.getRecentActivitiesSchema),
  pgCommunityAnalyticsController.getRecentActivities
);

/**
 * @route POST /api/events/:eventId/register
 * @desc Register user for an event
 * @access Private (Residents only)
 */
router.post(
  '/events/:eventId/register',
  authenticateToken,
  pgCommunityAnalyticsController.registerForEvent
);

/**
 * @route DELETE /api/events/:eventId/register
 * @desc Unregister user from an event
 * @access Private (Residents only)
 */
router.delete(
  '/events/:eventId/register',
  authenticateToken,
  pgCommunityAnalyticsController.unregisterFromEvent
);

/**
 * @route GET /api/events/:eventId/registration-status
 * @desc Get user's registration status for a specific event
 * @access Private (Residents only)
 */
router.get(
  '/events/:eventId/registration-status',
  authenticateToken,
  pgCommunityAnalyticsController.getUserEventRegistrationStatus
);

/**
 * @route GET /api/user/event-registrations
 * @desc Get all user's event registrations with filters and pagination
 * @query page, limit, status, eventType, upcoming, sortBy, sortOrder
 * @access Private (Residents only)
 */
router.get(
  '/user/event-registrations',
  authenticateToken,
  pgCommunityAnalyticsController.getUserEventRegistrations
);

/**
 * @route GET /api/events/:eventId/attendees
 * @desc Get event attendees (for PG owners)
 * @query page, limit, status, sortBy, sortOrder
 * @access Private (PG Owner only)
 */
router.get(
  '/events/:eventId/attendees',
  authenticateToken,
  pgCommunityAnalyticsController.getEventAttendees
);

/**
 * @route PUT /api/events/:eventId/attendance/:userId
 * @desc Mark attendance for a specific user in an event
 * @body { status: 'ATTENDED' | 'NO_SHOW' | 'CANCELLED' }
 * @access Private (PG Owner only)
 */
router.put(
  '/events/:eventId/attendance/:userId',
  authenticateToken,
  pgCommunityAnalyticsController.markEventAttendance
);




export { router as pgAnalyticsRouter };