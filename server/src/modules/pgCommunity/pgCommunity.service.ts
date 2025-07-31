import { prisma } from '../../lib/prisma';
import { AppError } from '../../utils/errors';

interface CreatePgCommunityData {
  name: string;
  address: string;
  description?: string;
  ownerId: string;
}

interface UpdatePgCommunityData {
  name?: string;
  address?: string;
  description?: string;
}

export const pgCommunityService = {
  // Create a new PG community
  async createPgCommunity(data: CreatePgCommunityData) {
    // Verify that the owner exists and is a PG_OWNER
    const owner = await prisma.user.findUnique({
      where: { 
        id: data.ownerId,
        role: 'PG_OWNER'
      }
    });

    if (!owner) {
      throw new AppError('Invalid owner ID or user is not a PG Owner', 400);
    }

    // Generate a unique PG code
    const pgCode = await this.generateUniquePgCode();

    const pgCommunity = await prisma.pgCommunity.create({
      data: {
        name: data.name,
        address: data.address,
        description: data.description,
        pgCode: pgCode,
        ownerId: data.ownerId,
      },
      include: {
        owner: {
          select: { id: true, name: true, email: true }
        },
        _count: {
          select: {
            residents: true,
            issues: true,
            services: true,
            technicians: true
          }
        }
      }
    });

    return pgCommunity;
  },

  // Get all PG communities for a specific owner
  async getPgCommunitiesByOwner(ownerId: string) {
    // Verify owner exists and is PG_OWNER
    const owner = await prisma.user.findUnique({
      where: { 
        id: ownerId,
        role: 'PG_OWNER'
      }
    });

    if (!owner) {
      throw new AppError('Owner not found or invalid role', 404);
    }

    const pgCommunities = await prisma.pgCommunity.findMany({
      where: { ownerId },
      include: {
        owner: {
          select: { id: true, name: true, email: true }
        },
        residents: {
          select: { id: true, name: true, email: true, createdAt: true }
        },
        _count: {
          select: {
            residents: true,
            issues: true,
            services: true,
            technicians: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return pgCommunities;
  },

  // Get a specific PG community by ID
  async getPgCommunityById(id: string, requesterId?: string) {
    const pgCommunity = await prisma.pgCommunity.findUnique({
      where: { id },
      include: {
        owner: {
          select: { id: true, name: true, email: true }
        },
        residents: {
          select: { 
            id: true, 
            name: true, 
            email: true, 
            profilePicture: true,
            createdAt: true 
          },
          orderBy: { createdAt: 'desc' }
        },
        issues: {
          include: {
            raisedBy: {
              select: { id: true, name: true }
            },
            assignedTechnician: {
              select: { id: true, name: true, speciality: true }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10 // Latest 10 issues
        },
        services: {
          include: {
            requestedBy: {
              select: { id: true, name: true }
            },
            assignedTechnician: {
              select: { id: true, name: true, speciality: true }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10 // Latest 10 services
        },
        technicians: {
          include: {
            technician: {
              select: {
                id: true,
                name: true,
                phoneNumber: true,
                speciality: true,
                isAvailable: true
              }
            }
          }
        },
        _count: {
          select: {
            residents: true,
            issues: true,
            services: true,
            technicians: true
          }
        }
      }
    });

    if (!pgCommunity) {
      throw new AppError('PG Community not found', 404);
    }

    // Check if requester has access to this PG community
    if (requesterId) {
      const requester = await prisma.user.findUnique({
        where: { id: requesterId },
        select: { role: true, pgCommunityId: true }
      });

      if (requester) {
        // PG owner can access their own communities
        // Residents can access their community
        const hasAccess = 
          (requester.role === 'PG_OWNER' && pgCommunity.ownerId === requesterId) ||
          (requester.role === 'RESIDENT' && requester.pgCommunityId === id);

        if (!hasAccess) {
          throw new AppError('Access denied to this PG community', 403);
        }
      }
    }

    return pgCommunity;
  },

  // Get PG community by pgCode (public - for residents during signup)
  async getPgCommunityByCode(pgCode: string) {
    const pgCommunity = await prisma.pgCommunity.findUnique({
      where: { pgCode },
      include: {
        owner: {
          select: { id: true, name: true, email: true }
        },
        _count: {
          select: {
            residents: true,
            issues: true,
            services: true
          }
        }
      }
    });

    if (!pgCommunity) {
      throw new AppError('PG Community not found', 404);
    }

    return pgCommunity;
  },

  // Update PG community
  async updatePgCommunity(id: string, data: UpdatePgCommunityData, ownerId: string) {
    // Verify the PG community exists and belongs to the owner
    const existingPgCommunity = await prisma.pgCommunity.findUnique({
      where: { id },
      select: { ownerId: true }
    });

    if (!existingPgCommunity) {
      throw new AppError('PG Community not found', 404);
    }

    if (existingPgCommunity.ownerId !== ownerId) {
      throw new AppError('Access denied. You can only update your own PG communities', 403);
    }

    const updatedPgCommunity = await prisma.pgCommunity.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.address && { address: data.address }),
        ...(data.description !== undefined && { description: data.description }),
        updatedAt: new Date()
      },
      include: {
        owner: {
          select: { id: true, name: true, email: true }
        },
        _count: {
          select: {
            residents: true,
            issues: true,
            services: true,
            technicians: true
          }
        }
      }
    });

    return updatedPgCommunity;
  },

  // Delete PG community
  async deletePgCommunity(id: string, ownerId: string) {
    // Verify the PG community exists and belongs to the owner
    const existingPgCommunity = await prisma.pgCommunity.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            residents: true,
            issues: true,
            services: true
          }
        }
      }
    });

    if (!existingPgCommunity) {
      throw new AppError('PG Community not found', 404);
    }

    if (existingPgCommunity.ownerId !== ownerId) {
      throw new AppError('Access denied. You can only delete your own PG communities', 403);
    }

    // Check if there are active residents, issues, or services
    if (existingPgCommunity._count.residents > 0) {
      throw new AppError('Cannot delete PG community with active residents. Please remove all residents first.', 400);
    }

    if (existingPgCommunity._count.issues > 0 || existingPgCommunity._count.services > 0) {
      throw new AppError('Cannot delete PG community with active issues or services. Please resolve all issues and services first.', 400);
    }

    // Delete the PG community (this will cascade delete technician assignments)
    await prisma.pgCommunity.delete({
      where: { id }
    });

    return { message: 'PG Community deleted successfully' };
  },

  // Get PG community statistics
  async getPgCommunityStats(id: string, ownerId: string) {
    // Verify access
    const pgCommunity = await prisma.pgCommunity.findUnique({
      where: { id },
      select: { ownerId: true }
    });

    if (!pgCommunity) {
      throw new AppError('PG Community not found', 404);
    }

    if (pgCommunity.ownerId !== ownerId) {
      throw new AppError('Access denied', 403);
    }

    // Get comprehensive statistics
    const stats = await prisma.pgCommunity.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            residents: true,
            issues: true,
            services: true,
            technicians: true
          }
        },
        issues: {
          select: { status: true, priorityLevel: true },
        },
        services: {
          select: { status: true, priorityLevel: true },
        }
      }
    });

    if (!stats) {
      throw new AppError('PG Community not found', 404);
    }

    // Process issue statistics
    const issueStats = {
      total: stats.issues.length,
      pending: stats.issues.filter(i => i.status === 'PENDING').length,
      assigned: stats.issues.filter(i => i.status === 'ASSIGNED').length,
      inProgress: stats.issues.filter(i => i.status === 'IN_PROGRESS').length,
      resolved: stats.issues.filter(i => i.status === 'RESOLVED').length,
      critical: stats.issues.filter(i => i.priorityLevel === 'P1').length,
      high: stats.issues.filter(i => i.priorityLevel === 'P2').length,
    };

    // Process service statistics
    const serviceStats = {
      total: stats.services.length,
      pending: stats.services.filter(s => s.status === 'PENDING').length,
      awaitingApproval: stats.services.filter(s => s.status === 'AWAITING_APPROVAL').length,
      approved: stats.services.filter(s => s.status === 'APPROVED').length,
      completed: stats.services.filter(s => s.status === 'COMPLETED').length,
      rejected: stats.services.filter(s => s.status === 'REJECTED').length,
    };

    return {
      id: stats.id,
      name: stats.name,
      totalResidents: stats._count.residents,
      totalTechnicians: stats._count.technicians,
      issues: issueStats,
      services: serviceStats
    };
  },

  // Generate unique PG code
  async generateUniquePgCode(): Promise<string> {
    let pgCode: string;
    let isUnique = false;

    while (!isUnique) {
      // Generate a 6-character alphanumeric code
      pgCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      const existing = await prisma.pgCommunity.findUnique({
        where: { pgCode }
      });
      
      if (!existing) {
        isUnique = true;
      }
    }

    return pgCode!;
  },

  // Search PG communities (for admin purposes)
  async searchPgCommunities(query: string, limit: number = 10) {
    const pgCommunities = await prisma.pgCommunity.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { address: { contains: query, mode: 'insensitive' } },
          { pgCode: { contains: query, mode: 'insensitive' } },
          { owner: { name: { contains: query, mode: 'insensitive' } } }
        ]
      },
      include: {
        owner: {
          select: { id: true, name: true, email: true }
        },
        _count: {
          select: {
            residents: true,
            issues: true,
            services: true
          }
        }
      },
      take: limit,
      orderBy: { createdAt: 'desc' }
    });

    return pgCommunities;
  }
};