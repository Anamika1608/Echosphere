import { Router } from 'express';
import { technicianController } from './technician.controller';
import { authenticateToken } from '../../middleware/authenticate.middleware';

const router = Router();

/**
 * @route POST /api/technician
 * @desc Create a new technician for a specific PG community
 * @access Private (PG Owner only)
 */
router.post(
  '/',
  authenticateToken,
  technicianController.createTechnician
);

/**
 * @route GET /api/technician/pg/:pgCommunityId
 * @desc Get all technicians for a specific PG community
 * @access Private (PG Owner or Resident of that community)
 */
router.get(
  '/pg/:pgCommunityId',
  authenticateToken,
  technicianController.getTechniciansForPg
);

/**
 * @route GET /api/technician/owner/available/:pgCommunityId
 * @desc Get available technicians from other PG communities that can be imported
 * @access Private (PG Owner only)
 */
router.get(
  '/owner/available/:pgCommunityId',
  authenticateToken,
  technicianController.getAvailableTechniciansFromOtherPgs
);

/**
 * @route GET /api/technician/owner/all
 * @desc Get all technicians managed by the owner across all their PG communities
 * @access Private (PG Owner only)
 */
router.get(
  '/owner/all',
  authenticateToken,
  technicianController.getTechniciansByOwner
);

/**
 * @route GET /api/technician/:id
 * @desc Get technician by ID with workload details
 * @access Private (PG Owner only)
 */
router.get(
  '/:id',
  authenticateToken,
  technicianController.getTechnicianById
);

/**
 * @route PUT /api/technician/:id/availability
 * @desc Update technician availability status
 * @access Private (PG Owner only)
 */
router.put(
  '/:id/availability',
  authenticateToken,
  technicianController.updateTechnicianAvailability
);

/**
 * @route POST /api/technician/:id/assign
 * @desc Assign technician to additional PG communities
 * @access Private (PG Owner only)
 */
router.post(
  '/:id/assign',
  authenticateToken,
  technicianController.assignTechnicianToPgs
);

/**
 * @route DELETE /api/technician/:id/remove
 * @desc Remove technician from specific PG communities
 * @access Private (PG Owner only)
 */
router.delete(
  '/:id/remove',
  authenticateToken,
  technicianController.removeTechnicianFromPgs
);

/**
 * @route GET /api/technician/:id/workload
 * @desc Get detailed workload statistics for a technician
 * @access Private (PG Owner only)
 */
router.get(
  '/:id/workload',
  authenticateToken,
  technicianController.getTechnicianWorkload
);

/**
 * @route DELETE /api/technician/:id
 * @desc Delete a technician (only if not assigned to any tasks)
 * @access Private (PG Owner only)
 */
router.delete(
  '/:id',
  authenticateToken,
  technicianController.deleteTechnician
);

/**
 * @route PUT /api/technician/:id
 * @desc Update technician details
 * @access Private (PG Owner only)
 */
router.put(
  '/:id',
  authenticateToken,
  technicianController.updateTechnician
);

export { router as technicianRouter };