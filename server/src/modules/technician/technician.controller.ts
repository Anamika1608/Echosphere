import { Response, NextFunction } from 'express';
import { technicianService } from '../technician/technician.service';
import { AppError } from '../../utils/errors';
import { AuthenticatedRequest } from '../../middleware/authenticate.middleware';

export const technicianController = {
    // Create a new technician
    async createTechnician(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new AppError('Authentication required', 401);
            }

            if (req.user.role !== 'PG_OWNER') {
                throw new AppError('Only PG owners can create technicians', 403);
            }

            const { name, phoneNumber, speciality, isAvailable, pgCommunityId } = req.body;

            // Verify PG community ownership
            await technicianService.verifyPgOwnership(pgCommunityId, req.user.userId);

            const technician = await technicianService.createTechnician({
                name,
                phoneNumber,
                speciality,
                isAvailable,
                pgCommunityId
            });

            res.status(201).json({
                success: true,
                message: 'Technician created successfully',
                data: technician
            });
        } catch (error) {
            next(error);
        }
    },

    // Get technicians for a specific PG community
    async getTechniciansForPg(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new AppError('Authentication required', 401);
            }

            const { pgCommunityId } = req.params;
            const { speciality } = req.query;

            // Verify access to PG community
            await technicianService.verifyPgAccess(pgCommunityId, req.user.userId, req.user.role);

            const technicians = await technicianService.getTechniciansForPg(
                pgCommunityId,
                speciality as any
            );

            res.status(200).json({
                success: true,
                message: 'Technicians retrieved successfully',
                data: technicians
            });
        } catch (error) {
            next(error);
        }
    },

    // Get all technicians managed by the owner
    async getTechniciansByOwner(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new AppError('Authentication required', 401);
            }

            if (req.user.role !== 'PG_OWNER') {
                throw new AppError('Only PG owners can view their technicians', 403);
            }

            const technicians = await technicianService.getTechniciansByOwner(req.user.userId);

            res.status(200).json({
                success: true,
                message: 'Technicians retrieved successfully',
                data: technicians
            });
        } catch (error) {
            next(error);
        }
    },

    // Get technician by ID
    async getTechnicianById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new AppError('Authentication required', 401);
            }

            const { id } = req.params;

            const technician = await technicianService.getTechnicianById(id);

            // Verify ownership
            await technicianService.verifyTechnicianOwnership(id, req.user.userId);

            res.status(200).json({
                success: true,
                message: 'Technician retrieved successfully',
                data: technician
            });
        } catch (error) {
            next(error);
        }
    },

    // Update technician availability
    async updateTechnicianAvailability(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new AppError('Authentication required', 401);
            }

            if (req.user.role !== 'PG_OWNER') {
                throw new AppError('Only PG owners can update technician availability', 403);
            }

            const { id } = req.params;
            const { isAvailable } = req.body;

            // Verify ownership
            await technicianService.verifyTechnicianOwnership(id, req.user.userId);

            const technician = await technicianService.updateTechnicianAvailability(id, isAvailable);

            res.status(200).json({
                success: true,
                message: 'Technician availability updated successfully',
                data: technician
            });
        } catch (error) {
            next(error);
        }
    },

    // Assign technician to additional PG communities
    async assignTechnicianToPgs(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new AppError('Authentication required', 401);
            }

            if (req.user.role !== 'PG_OWNER') {
                throw new AppError('Only PG owners can assign technicians', 403);
            }

            const { id } = req.params;
            const { pgCommunityIds } = req.body;

            // Verify ownership of technician and all PG communities
            await technicianService.verifyTechnicianOwnership(id, req.user.userId);

            for (const pgId of pgCommunityIds) {
                await technicianService.verifyPgOwnership(pgId, req.user.userId);
            }

            const technician = await technicianService.assignTechnicianToPgs({
                technicianId: id,
                pgCommunityIds
            });

            res.status(200).json({
                success: true,
                message: 'Technician assigned to PG communities successfully',
                data: technician
            });
        } catch (error) {
            next(error);
        }
    },

    // Remove technician from PG communities
    async removeTechnicianFromPgs(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new AppError('Authentication required', 401);
            }

            if (req.user.role !== 'PG_OWNER') {
                throw new AppError('Only PG owners can remove technician assignments', 403);
            }

            const { id } = req.params;
            const { pgCommunityIds } = req.body;

            // Verify ownership
            await technicianService.verifyTechnicianOwnership(id, req.user.userId);

            const technician = await technicianService.removeTechnicianFromPgs(id, pgCommunityIds);

            res.status(200).json({
                success: true,
                message: 'Technician removed from PG communities successfully',
                data: technician
            });
        } catch (error) {
            next(error);
        }
    },

    // Get technician workload
    async getTechnicianWorkload(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new AppError('Authentication required', 401);
            }

            const { id } = req.params;

            // Verify ownership
            await technicianService.verifyTechnicianOwnership(id, req.user.userId);

            const workloadData = await technicianService.getTechnicianWorkload(id);

            res.status(200).json({
                success: true,
                message: 'Technician workload retrieved successfully',
                data: workloadData
            });
        } catch (error) {
            next(error);
        }
    },

    // Update technician details
    async updateTechnician(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new AppError('Authentication required', 401);
            }

            if (req.user.role !== 'PG_OWNER') {
                throw new AppError('Only PG owners can update technicians', 403);
            }

            const { id } = req.params;
            const updateData = req.body;

            // Verify ownership
            await technicianService.verifyTechnicianOwnership(id, req.user.userId);

            const technician = await technicianService.updateTechnician(id, updateData);

            res.status(200).json({
                success: true,
                message: 'Technician updated successfully',
                data: technician
            });
        } catch (error) {
            next(error);
        }
    },

    // Delete technician
    async deleteTechnician(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new AppError('Authentication required', 401);
            }

            if (req.user.role !== 'PG_OWNER') {
                throw new AppError('Only PG owners can delete technicians', 403);
            }

            const { id } = req.params;

            // Verify ownership
            await technicianService.verifyTechnicianOwnership(id, req.user.userId);

            await technicianService.deleteTechnician(id);

            res.status(200).json({
                success: true,
                message: 'Technician deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    },

   async getAvailableTechniciansFromOtherPgs(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new AppError('Authentication required', 401);
            }

            if (req.user.role !== 'PG_OWNER') {
                throw new AppError('Only PG owners can view available technicians', 403);
            }

            const { pgCommunityId } = req.params;

            // Verify PG ownership
            await technicianService.verifyPgOwnership(pgCommunityId, req.user.userId);

            const technicians = await technicianService.getAvailableTechniciansFromOtherPgs(
                pgCommunityId,
                req.user.userId
            );

            res.status(200).json({
                success: true,
                message: 'Available technicians retrieved successfully',
                data: technicians
            });
        } catch (error) {
            next(error);
        }
    }
};
