import { prisma } from '../../lib/prisma';
import { TechnicianField } from '@prisma/client';
import { AppError } from '../../utils/errors';

interface CreateTechnicianData {
    name: string;
    phoneNumber: string;
    speciality: TechnicianField;
    isAvailable?: boolean;
    pgCommunityId: string;
}

interface AssignTechnicianToPgData {
    technicianId: string;
    pgCommunityIds: string[];
}

interface UpdateTechnicianData {
    name?: string;
    phoneNumber?: string;
    speciality?: TechnicianField;
    isAvailable?: boolean;
}

export const technicianService = {
    // Create a new technician and assign to PG community
    async createTechnician(data: CreateTechnicianData) {
        const technician = await prisma.technician.create({
            data: {
                name: data.name,
                phoneNumber: data.phoneNumber,
                speciality: data.speciality,
                isAvailable: data.isAvailable ?? true,
                pgAssignments: {
                    create: {
                        pgCommunityId: data.pgCommunityId
                    }
                }
            },
            include: {
                pgAssignments: {
                    include: {
                        pgCommunity: {
                            select: { 
                                id: true, 
                                name: true, 
                                pgCode: true,
                                owner: {
                                    select: { id: true, name: true, email: true }
                                }
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        assignedIssues: { where: { status: { not: 'RESOLVED' } } },
                        assignedServices: { where: { status: { not: 'COMPLETED' } } }
                    }
                }
            }
        });

        return technician;
    },

    // Assign technician to multiple PG communities
    async assignTechnicianToPgs(data: AssignTechnicianToPgData) {
        const technician = await prisma.technician.findUnique({
            where: { id: data.technicianId }
        });

        if (!technician) {
            throw new AppError('Technician not found', 404);
        }

        const pgCommunities = await prisma.pgCommunity.findMany({
            where: {
                id: { in: data.pgCommunityIds }
            }
        });

        if (pgCommunities.length !== data.pgCommunityIds.length) {
            throw new AppError('One or more PG communities not found', 404);
        }

        const assignments = data.pgCommunityIds.map(pgCommunityId => ({
            technicianId: data.technicianId,
            pgCommunityId
        }));

        await prisma.technicianPgAssignment.createMany({
            data: assignments,
            skipDuplicates: true
        });

        return await this.getTechnicianById(data.technicianId);
    },

    // Remove technician from specific PG communities
    async removeTechnicianFromPgs(technicianId: string, pgCommunityIds: string[]) {
        await prisma.technicianPgAssignment.deleteMany({
            where: {
                technicianId,
                pgCommunityId: { in: pgCommunityIds }
            }
        });

        return await this.getTechnicianById(technicianId);
    },

    // Get technician by ID with all assignments
    async getTechnicianById(technicianId: string) {
        const technician = await prisma.technician.findUnique({
            where: { id: technicianId },
            include: {
                pgAssignments: {
                    include: {
                        pgCommunity: {
                            select: {
                                id: true,
                                name: true,
                                pgCode: true,
                                owner: {
                                    select: { id: true, name: true, email: true }
                                }
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        assignedIssues: { where: { status: { not: 'RESOLVED' } } },
                        assignedServices: { where: { status: { not: 'COMPLETED' } } }
                    }
                }
            }
        });

        if (!technician) {
            throw new AppError('Technician not found', 404);
        }

        return technician;
    },

    // Get all technicians available for a specific PG community
    async getTechniciansForPg(pgCommunityId: string, speciality?: TechnicianField) {
        const whereClause: any = {
            pgAssignments: {
                some: {
                    pgCommunityId
                }
            }
        };

        if (speciality) {
            whereClause.speciality = speciality;
        }

        const technicians = await prisma.technician.findMany({
            where: whereClause,
            include: {
                pgAssignments: {
                    include: {
                        pgCommunity: {
                            select: { id: true, name: true, pgCode: true }
                        }
                    }
                },
                _count: {
                    select: {
                        assignedIssues: { where: { status: { not: 'RESOLVED' } } },
                        assignedServices: { where: { status: { not: 'COMPLETED' } } }
                    }
                }
            },
            orderBy: { name: 'asc' }
        });

        return technicians;
    },

    // Get all technicians managed by a PG owner (across all their PG communities)
    async getTechniciansByOwner(ownerId: string) {
        const technicians = await prisma.technician.findMany({
            where: {
                pgAssignments: {
                    some: {
                        pgCommunity: {
                            ownerId
                        }
                    }
                }
            },
            include: {
                pgAssignments: {
                    include: {
                        pgCommunity: {
                            select: { id: true, name: true, pgCode: true }
                        }
                    },
                    where: {
                        pgCommunity: {
                            ownerId
                        }
                    }
                },
                _count: {
                    select: {
                        assignedIssues: { where: { status: { not: 'RESOLVED' } } },
                        assignedServices: { where: { status: { not: 'COMPLETED' } } }
                    }
                }
            },
            orderBy: { name: 'asc' }
        });

        return technicians;
    },

    // Update technician availability
    async updateTechnicianAvailability(technicianId: string, isAvailable: boolean) {
        const technician = await prisma.technician.update({
            where: { id: technicianId },
            data: { isAvailable },
            include: {
                pgAssignments: {
                    include: {
                        pgCommunity: {
                            select: { id: true, name: true, pgCode: true }
                        }
                    }
                },
                _count: {
                    select: {
                        assignedIssues: { where: { status: { not: 'RESOLVED' } } },
                        assignedServices: { where: { status: { not: 'COMPLETED' } } }
                    }
                }
            }
        });

        return technician;
    },

    // Update technician details
    async updateTechnician(technicianId: string, data: UpdateTechnicianData) {
        const technician = await prisma.technician.update({
            where: { id: technicianId },
            data,
            include: {
                pgAssignments: {
                    include: {
                        pgCommunity: {
                            select: { id: true, name: true, pgCode: true }
                        }
                    }
                },
                _count: {
                    select: {
                        assignedIssues: { where: { status: { not: 'RESOLVED' } } },
                        assignedServices: { where: { status: { not: 'COMPLETED' } } }
                    }
                }
            }
        });

        return technician;
    },

    // Delete technician (only if not assigned to any active tasks)
    async deleteTechnician(technicianId: string) {
        // Check if technician has active tasks
        const activeTasksCount = await prisma.technician.findUnique({
            where: { id: technicianId },
            select: {
                _count: {
                    select: {
                        assignedIssues: { where: { status: { not: 'RESOLVED' } } },
                        assignedServices: { where: { status: { not: 'COMPLETED' } } }
                    }
                }
            }
        });

        if (!activeTasksCount) {
            throw new AppError('Technician not found', 404);
        }

        const totalActiveTasks = activeTasksCount._count.assignedIssues + activeTasksCount._count.assignedServices;
        
        if (totalActiveTasks > 0) {
            throw new AppError('Cannot delete technician with active assignments', 400);
        }

        // First delete all assignments
        await prisma.technicianPgAssignment.deleteMany({
            where: { technicianId }
        });

        // Then delete the technician
        await prisma.technician.delete({
            where: { id: technicianId }
        });

        return { message: 'Technician deleted successfully' };
    },

    // Get technician workload statistics
    async getTechnicianWorkload(technicianId: string) {
        const technician = await prisma.technician.findUnique({
            where: { id: technicianId },
            include: {
                assignedIssues: {
                    where: { status: { not: 'RESOLVED' } },
                    select: { 
                        id: true, 
                        title: true, 
                        priorityLevel: true, 
                        status: true,
                        pgCommunity: {
                            select: { name: true, pgCode: true }
                        }
                    }
                },
                assignedServices: {
                    where: { status: { not: 'COMPLETED' } },
                    select: { 
                        id: true, 
                        title: true, 
                        priorityLevel: true, 
                        status: true,
                        pgCommunity: {
                            select: { name: true, pgCode: true }
                        }
                    }
                },
                pgAssignments: {
                    include: {
                        pgCommunity: {
                            select: { id: true, name: true, pgCode: true }
                        }
                    }
                }
            }
        });

        if (!technician) {
            throw new AppError('Technician not found', 404);
        }

        return {
            technician,
            workload: {
                activeIssues: technician.assignedIssues.length,
                activeServices: technician.assignedServices.length,
                totalActiveTasks: technician.assignedIssues.length + technician.assignedServices.length,
                assignedPgs: technician.pgAssignments.length
            }
        };
    },

    // Verify PG community ownership
    async verifyPgOwnership(pgCommunityId: string, ownerId: string) {
        const pgCommunity = await prisma.pgCommunity.findFirst({
            where: {
                id: pgCommunityId,
                ownerId
            }
        });

        if (!pgCommunity) {
            throw new AppError('PG community not found or access denied', 403);
        }

        return pgCommunity;
    },

    // Verify technician ownership (technician belongs to owner's PG)
    async verifyTechnicianOwnership(technicianId: string, ownerId: string) {
        const technician = await prisma.technician.findFirst({
            where: {
                id: technicianId,
                pgAssignments: {
                    some: {
                        pgCommunity: {
                            ownerId
                        }
                    }
                }
            }
        });

        if (!technician) {
            throw new AppError('Technician not found or access denied', 403);
        }

        return technician;
    },

    // Verify PG community access (for residents and owners)
    async verifyPgAccess(pgCommunityId: string, userId: string, userRole: string) {
        if (userRole === 'PG_OWNER') {
            return await this.verifyPgOwnership(pgCommunityId, userId);
        } else if (userRole === 'RESIDENT') {
            const resident = await prisma.user.findFirst({
                where: {
                    id: userId,
                    pgCommunityId
                }
            });

            if (!resident) {
                throw new AppError('Access denied to this PG community', 403);
            }

            return resident;
        } else {
            throw new AppError('Invalid user role', 403);
        }
    },

    // Get available technicians from other PG communities owned by the same owner
    async getAvailableTechniciansFromOtherPgs(currentPgId: string, ownerId: string) {
        const technicians = await prisma.technician.findMany({
            where: {
                pgAssignments: {
                    some: {
                        pgCommunity: {
                            ownerId,
                            id: { not: currentPgId }
                        }
                    },
                    none: {
                        pgCommunityId: currentPgId
                    }
                }
            },
            include: {
                pgAssignments: {
                    include: {
                        pgCommunity: {
                            select: { id: true, name: true, pgCode: true }
                        }
                    },
                    where: {
                        pgCommunity: {
                            ownerId
                        }
                    }
                },
                _count: {
                    select: {
                        assignedIssues: { where: { status: { not: 'RESOLVED' } } },
                        assignedServices: { where: { status: { not: 'COMPLETED' } } }
                    }
                }
            },
            orderBy: { name: 'asc' }
        });

        return technicians;
    }
};