import { prisma } from '../../lib/prisma';
import { TechnicianField } from '@prisma/client';
import { AppError } from '../../utils/errors';

interface CreateTechnicianData {
    name: string;
    phoneNumber: string;
    speciality: TechnicianField;
    isAvailable?: boolean;
}

interface AssignTechnicianToPgData {
    technicianId: string;
    pgCommunityIds: string[]; // Array of PG community IDs
}

export const technicianService = {
    // Create a new technician
    async createTechnician(data: CreateTechnicianData) {
        const technician = await prisma.technician.create({
            data: {
                name: data.name,
                phoneNumber: data.phoneNumber,
                speciality: data.speciality,
                isAvailable: data.isAvailable ?? true,
            },
            include: {
                pgAssignments: {
                    include: {
                        pgCommunity: {
                            include: {
                                owner: {
                                    select: { id: true, name: true, email: true }
                                }
                            }
                        }
                    }
                }
            }
        });

        return technician;
    },

    // Assign technician to multiple PG communities
    async assignTechnicianToPgs(data: AssignTechnicianToPgData) {
        // Verify technician exists
        const technician = await prisma.technician.findUnique({
            where: { id: data.technicianId }
        });

        if (!technician) {
            throw new AppError('Technician not found', 404);
        }

        // Verify all PG communities exist
        const pgCommunities = await prisma.pgCommunity.findMany({
            where: {
                id: { in: data.pgCommunityIds }
            }
        });

        if (pgCommunities.length !== data.pgCommunityIds.length) {
            throw new AppError('One or more PG communities not found', 404);
        }

        // Create assignments (using createMany with skipDuplicates to avoid errors)
        const assignments = data.pgCommunityIds.map(pgCommunityId => ({
            technicianId: data.technicianId,
            pgCommunityId
        }));

        await prisma.technicianPgAssignment.createMany({
            data: assignments,
            skipDuplicates: true
        });

        // Return updated technician with assignments
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
                            include: {
                                owner: {
                                    select: { id: true, name: true, email: true }
                                }
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        assignedIssues: true,
                        assignedServices: true
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
            },
            isAvailable: true
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
                        assignedIssues: true,
                        assignedServices: true
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
                }
            }
        });

        return technician;
    },

    // Get technician workload statistics
    async getTechnicianWorkload(technicianId: string) {
        const technician = await prisma.technician.findUnique({
            where: { id: technicianId },
            include: {
                assignedIssues: {
                    where: { status: { not: 'RESOLVED' } },
                    select: { id: true, title: true, priorityLevel: true, status: true }
                },
                assignedServices: {
                    where: { status: { not: 'COMPLETED' } },
                    select: { id: true, title: true, priorityLevel: true, status: true }
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
    }
};