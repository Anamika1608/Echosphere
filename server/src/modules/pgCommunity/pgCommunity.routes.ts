import { Router } from 'express';
import { pgCommunityController } from '../pgCommunity/pgCommunity.controller';
import { 
  createPgCommunitySchema,
  updatePgCommunitySchema,
  getPgCommunityByIdSchema,
  getPgCommunityByCodeSchema,
  searchPgCommunitiesSchema,
  validate 
} from '../pgCommunity/pgCommunity.validation';
import { authenticateToken } from '../../middleware/authenticate.middleware';

const router = Router();

// Public routes (no authentication required)
/**
 * @route GET /api/pg-community/code/:pgCode
 * @desc Get PG community by code (for residents during signup)
 * @access Public
 */
router.get(
  '/code/:pgCode',
  validate(getPgCommunityByCodeSchema),
  pgCommunityController.getPgCommunityByCode
);

/**
 * @route GET /api/pg-community/search
 * @desc Search PG communities
 * @access Public
 */
router.get(
  '/search',
  validate(searchPgCommunitiesSchema),
  pgCommunityController.searchPgCommunities
);

// Protected routes (authentication required)
/**
 * @route POST /api/pg-community
 * @desc Create a new PG community
 * @access Private (PG Owner only)
 */
router.post(
  '/',
  authenticateToken,
  validate(createPgCommunitySchema),
  pgCommunityController.createPgCommunity
);

/**
 * @route GET /api/pg-community/my-communities
 * @desc Get all PG communities owned by authenticated user
 * @access Private (PG Owner only)
 */
router.get(
  '/my-communities',
  authenticateToken,
  pgCommunityController.getMyPgCommunities
);

/**
 * @route GET /api/pg-community/my-community
 * @desc Get resident's PG community
 * @access Private (Resident only)
 */
router.get(
  '/my-community',
  authenticateToken,
  pgCommunityController.getMyPgCommunity
);

/**
 * @route GET /api/pg-community/:id
 * @desc Get a specific PG community by ID
 * @access Private (Owner or Resident of that community)
 */
router.get(
  '/:id',
  authenticateToken,
  validate(getPgCommunityByIdSchema),
  pgCommunityController.getPgCommunityById
);

/**
 * @route PUT /api/pg-community/:id
 * @desc Update a PG community
 * @access Private (PG Owner only - own communities)
 */
router.put(
  '/:id',
  authenticateToken,
  validate(updatePgCommunitySchema),
  pgCommunityController.updatePgCommunity
);

/**
 * @route DELETE /api/pg-community/:id
 * @desc Delete a PG community
 * @access Private (PG Owner only - own communities)
 */
router.delete(
  '/:id',
  authenticateToken,
  validate(getPgCommunityByIdSchema),
  pgCommunityController.deletePgCommunity
);

/**
 * @route GET /api/pg-community/:id/stats
 * @desc Get PG community statistics
 * @access Private (PG Owner only - own communities)
 */
router.get(
  '/:id/stats',
  authenticateToken,
  validate(getPgCommunityByIdSchema),
  pgCommunityController.getPgCommunityStats
);

/**
 * @route GET /api/pg-community/:id/residents
 * @desc Get all residents of a PG community
 * @access Private (PG Owner only - own communities)
 */
router.get(
  '/:id/residents',
  authenticateToken,
  validate(getPgCommunityByIdSchema),
  pgCommunityController.getPgCommunityResidents
);

export { router as pgCommunityRouter };