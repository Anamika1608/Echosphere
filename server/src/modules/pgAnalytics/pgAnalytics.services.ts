import { prisma } from '../../lib/prisma';
import { AppError } from '../../utils/errors';
import { UserRole } from '@prisma/client';

interface FilterOptions {
  status?: string;
  priority?: string;
  issueType?: string;
  serviceType?: string;
  eventType?: string;
  upcoming?: boolean;
}

interface PaginationOptions {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export const pgCommunityAnalyticsService = {
  // Verify user access to PG community
  async verifyPgAccess(pgId: string, userId: string, userRole: UserRole) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        id: true, 
        role: true, 
        pgCommunityId: true,
        ownedPgCommunities: {
          select: { id: true }
        }
      }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Check access based on role
    if (userRole === 'PG_OWNER') {
      const ownsThisPg = user.ownedPgCommunities.some(pg => pg.id === pgId);
      if (!ownsThisPg) {
        throw new AppError('Access denied. You can only view your own PG communities', 403);
      }
    } else if (userRole === 'RESIDENT') {
      if (user.pgCommunityId !== pgId) {
        throw new AppError('Access denied. You can only view your own PG community', 403);
      }
    }

    return true;
  },

  // Get user's raised issues
  async getUserRaisedIssues(
    userId: string,
    filters: FilterOptions,
    pagination: PaginationOptions
  ) {
    // Build where clause
    const where: any = { raisedById: userId };
    
    if (filters.status) where.status = filters.status;
    if (filters.priority) where.priorityLevel = filters.priority;
    if (filters.issueType) where.issueType = filters.issueType;

    // Calculate pagination
    const skip = (pagination.page - 1) * pagination.limit;

    // Get total count
    const totalCount = await prisma.raisedIssue.count({ where });

    // Get issues with pagination
    const issues = await prisma.raisedIssue.findMany({
      where,
      include: {
        raisedBy: {
          select: { 
            id: true, 
            name: true, 
            email: true,
            profilePicture: true 
          }
        },
        assignedTechnician: {
          select: { 
            id: true, 
            name: true, 
            phoneNumber: true,
            speciality: true 
          }
        },
        pgCommunity: {
          select: { id: true, name: true }
        }
      },
      orderBy: {
        [pagination.sortBy]: pagination.sortOrder
      },
      skip,
      take: pagination.limit
    });

    // Calculate summary statistics for user's issues
    const summary = await this.getUserIssuesSummary(userId);

    return {
      issues,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / pagination.limit),
        hasNext: pagination.page * pagination.limit < totalCount,
        hasPrev: pagination.page > 1
      },
      summary
    };
  },

  // Get user's requested services
  async getUserRequestedServices(
    userId: string,
    filters: FilterOptions,
    pagination: PaginationOptions
  ) {
    // Build where clause
    const where: any = { requestedById: userId };
    
    if (filters.status) where.status = filters.status;
    if (filters.priority) where.priorityLevel = filters.priority;
    if (filters.serviceType) where.serviceType = filters.serviceType;

    // Calculate pagination
    const skip = (pagination.page - 1) * pagination.limit;

    // Get total count
    const totalCount = await prisma.requestedService.count({ where });

    // Get services with pagination
    const services = await prisma.requestedService.findMany({
      where,
      include: {
        requestedBy: {
          select: { 
            id: true, 
            name: true, 
            email: true,
            profilePicture: true 
          }
        },
        assignedTechnician: {
          select: { 
            id: true, 
            name: true, 
            phoneNumber: true,
            speciality: true 
          }
        },
        pgCommunity: {
          select: { id: true, name: true }
        }
      },
      orderBy: {
        [pagination.sortBy]: pagination.sortOrder
      },
      skip,
      take: pagination.limit
    });

    // Calculate summary statistics for user's services
    const summary = await this.getUserServicesSummary(userId);

    return {
      services,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / pagination.limit),
        hasNext: pagination.page * pagination.limit < totalCount,
        hasPrev: pagination.page > 1
      },
      summary
    };
  },

  // Get user's attended events
  async getUserAttendedEvents(
    userId: string,
    filters: FilterOptions,
    pagination: PaginationOptions
  ) {
    // Build where clause for event attendance
    const where: any = { 
      userId: userId 
    };

    // Additional filters for the event itself
    const eventWhere: any = {};
    if (filters.eventType) eventWhere.eventType = filters.eventType;
    if (filters.upcoming) {
      eventWhere.startDate = { gte: new Date() };
    }

    // If we have event filters, we need to include them in the where clause
    if (Object.keys(eventWhere).length > 0) {
      where.event = eventWhere;
    }

    // Calculate pagination
    const skip = (pagination.page - 1) * pagination.limit;

    // Get total count
    const totalCount = await prisma.eventAttendance.count({ 
      where
    });

    // Get event attendances with pagination
    const attendances = await prisma.eventAttendance.findMany({
      where,
      include: {
        event: {
          include: {
            createdBy: {
              select: { 
                id: true, 
                name: true, 
                email: true 
              }
            },
            pgCommunity: {
              select: { id: true, name: true }
            },
            _count: {
              select: {
                attendances: true,
                feedbacks: true
              }
            }
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePicture: true
          }
        }
      },
      orderBy: {
        event: {
          [pagination.sortBy === 'createdAt' ? 'createdAt' : pagination.sortBy]: pagination.sortOrder
        }
      },
      skip,
      take: pagination.limit
    });

    // Transform data to focus on events
    const events = attendances.map(attendance => ({
      ...attendance.event,
      userAttendanceStatus: attendance.status,
      userAttendanceId: attendance.id,
      attendedAt: attendance.attendedAt
    }));

    // Calculate summary statistics for user's events
    const summary = await this.getUserEventsSummary(userId);

    return {
      events,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / pagination.limit),
        hasNext: pagination.page * pagination.limit < totalCount,
        hasPrev: pagination.page > 1
      },
      summary
    };
  },

  // Get user dashboard overview
  async getUserDashboardOverview(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        pgCommunity: {
          select: { 
            id: true, 
            name: true, 
            address: true,
            pgCode: true 
          }
        }
      }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const [
      issuesSummary,
      servicesSummary,
      eventsSummary,
      recentActivities
    ] = await Promise.all([
      this.getUserIssuesSummary(userId),
      this.getUserServicesSummary(userId),
      this.getUserEventsSummary(userId),
      this.getUserRecentActivities(userId, 10)
    ]);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        pgCommunity: user.pgCommunity
      },
      quickStats: {
        totalIssuesRaised: issuesSummary.total,
        totalServicesRequested: servicesSummary.total,
        totalEventsAttended: eventsSummary.totalAttended,
        pendingIssues: issuesSummary.pending,
        pendingServices: servicesSummary.pending,
        upcomingEvents: eventsSummary.upcoming
      },
      summaries: {
        issues: issuesSummary,
        services: servicesSummary,
        events: eventsSummary
      },
      recentActivities
    };
  },

  // Get user's recent activities
  async getUserRecentActivities(userId: string, limit: number = 20) {
    const [recentIssues, recentServices, recentEventAttendances] = await Promise.all([
      prisma.raisedIssue.findMany({
        where: { raisedById: userId },
        include: {
          pgCommunity: { select: { name: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: Math.ceil(limit / 3)
      }),
      prisma.requestedService.findMany({
        where: { requestedById: userId },
        include: {
          pgCommunity: { select: { name: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: Math.ceil(limit / 3)
      }),
      prisma.eventAttendance.findMany({
        where: { userId: userId },
        include: {
          event: {
            include: {
              pgCommunity: { select: { name: true } }
            }
          }
        },
        orderBy: {attendedAt : 'desc' },
        take: Math.ceil(limit / 3)
      })
    ]);

    // Combine and format activities
    const activities = [
      ...recentIssues.map(issue => ({
        id: issue.id,
        type: 'ISSUE' as const,
        title: issue.title,
        description: `Issue #${issue.ticketNumber} - ${issue.status}`,
        createdAt: issue.createdAt,
        status: issue.status,
        priority: issue.priorityLevel,
        pgCommunity: issue.pgCommunity?.name
      })),
      ...recentServices.map(service => ({
        id: service.id,
        type: 'SERVICE' as const,
        title: service.title,
        description: `Service #${service.ticketNumber} - ${service.status}`,
        createdAt: service.createdAt,
        status: service.status,
        priority: service.priorityLevel,
        pgCommunity: service.pgCommunity?.name
      })),
      ...recentEventAttendances.map(attendance => ({
        id: attendance.event.id,
        type: 'EVENT_ATTENDANCE' as const,
        title: `Attended: ${attendance.event.title}`,
        description: `Event attendance - ${attendance.status}`,
        createdAt: attendance.attendedAt,
        eventType: attendance.event.eventType,
        attendanceStatus: attendance.status,
        pgCommunity: attendance.event.pgCommunity?.name
      }))
    ];

    // Sort by creation date and limit
    return activities
      .sort((a, b) => ((b?.createdAt?.getTime?.() ?? 0) - (a?.createdAt?.getTime?.() ?? 0)))
      .slice(0, limit);
  },

  // Helper methods for user-specific summaries
  async getUserIssuesSummary(userId: string) {
    const issues = await prisma.raisedIssue.findMany({
      where: { raisedById: userId },
      select: { status: true, priorityLevel: true, createdAt: true, resolvedAt: true }
    });

    const resolvedIssues = issues.filter(i => i.status === 'RESOLVED' && i.resolvedAt);
    const averageResolutionTime = resolvedIssues.length > 0 
      ? this.calculateAverageResolutionTime(resolvedIssues)
      : 0;

    return {
      total: issues.length,
      pending: issues.filter(i => i.status === 'PENDING').length,
      assigned: issues.filter(i => i.status === 'ASSIGNED').length,
      inProgress: issues.filter(i => i.status === 'IN_PROGRESS').length,
      resolved: issues.filter(i => i.status === 'RESOLVED').length,
      critical: issues.filter(i => i.priorityLevel === 'P1').length,
      high: issues.filter(i => i.priorityLevel === 'P2').length,
      medium: issues.filter(i => i.priorityLevel === 'P3').length,
      low: issues.filter(i => i.priorityLevel === 'P4').length,
      averageResolutionTime
    };
  },

  async getUserServicesSummary(userId: string) {
    const services = await prisma.requestedService.findMany({
      where: { requestedById: userId },
      select: { status: true, priorityLevel: true, createdAt: true, completedAt: true }
    });

    const completedServices = services.filter(s => s.status === 'COMPLETED' && s.completedAt);
    const averageCompletionTime = completedServices.length > 0 
      ? this.calculateAverageCompletionTime(completedServices)
      : 0;

    return {
      total: services.length,
      pending: services.filter(s => s.status === 'PENDING').length,
      awaitingApproval: services.filter(s => s.status === 'AWAITING_APPROVAL').length,
      approved: services.filter(s => s.status === 'APPROVED').length,
      assigned: services.filter(s => s.status === 'ASSIGNED').length,
      inProgress: services.filter(s => s.status === 'IN_PROGRESS').length,
      completed: services.filter(s => s.status === 'COMPLETED').length,
      rejected: services.filter(s => s.status === 'REJECTED').length,
      averageCompletionTime
    };
  },

  async getUserEventsSummary(userId: string) {
    const now = new Date();
    const attendances = await prisma.eventAttendance.findMany({
      where: { userId: userId },
      include: {
        event: {
          select: {
            eventType: true,
            startDate: true,
            endDate: true,
            createdAt: true
          }
        }
      }
    });

    const events = attendances.map(a => a.event);
    const attendedEvents = attendances.filter(a => a.status === 'ATTENDED');

    return {
      totalRegistered: attendances.length,
      totalAttended: attendedEvents.length,
      upcoming: events.filter(e => e.startDate > now).length,
      ongoing: events.filter(e => e.startDate <= now && e.endDate >= now).length,
      completed: events.filter(e => e.endDate < now).length,
      attendanceRate: attendances.length > 0 
        ? Math.round((attendedEvents.length / attendances.length) * 100)
        : 0,
      typeDistribution: this.getDistribution(events, 'eventType')
    };
  },

  // Additional utility method for completion time
  calculateAverageCompletionTime(completedServices: any[]): number {
    if (completedServices.length === 0) return 0;
    
    const totalHours = completedServices.reduce((sum, service) => {
      const createdAt = new Date(service.createdAt);
      const completedAt = new Date(service.completedAt);
      const diffHours = (completedAt.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
      return sum + diffHours;
    }, 0);

    return Math.round(totalHours / completedServices.length);
  },

  // Get all raised issues for a PG community
  async getPgCommunityIssues(
    pgId: string, 
    userId: string, 
    userRole: UserRole,
    filters: FilterOptions,
    pagination: PaginationOptions
  ) {
    // Verify access
    await this.verifyPgAccess(pgId, userId, userRole);

    // Build where clause
    const where: any = { pgCommunityId: pgId };
    
    if (filters.status) where.status = filters.status;
    if (filters.priority) where.priorityLevel = filters.priority;
    if (filters.issueType) where.issueType = filters.issueType;

    // Calculate pagination
    const skip = (pagination.page - 1) * pagination.limit;

    // Get total count
    const totalCount = await prisma.raisedIssue.count({ where });

    // Get issues with pagination
    const issues = await prisma.raisedIssue.findMany({
      where,
      include: {
        raisedBy: {
          select: { 
            id: true, 
            name: true, 
            email: true,
            profilePicture: true 
          }
        },
        assignedTechnician: {
          select: { 
            id: true, 
            name: true, 
            phoneNumber: true,
            speciality: true 
          }
        },
        pgCommunity: {
          select: { id: true, name: true }
        }
      },
      orderBy: {
        [pagination.sortBy]: pagination.sortOrder
      },
      skip,
      take: pagination.limit
    });

    // Calculate summary statistics
    const summary = await this.getIssuesSummary(pgId);

    return {
      issues,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / pagination.limit),
        hasNext: pagination.page * pagination.limit < totalCount,
        hasPrev: pagination.page > 1
      },
      summary
    };
  },

  // Get all requested services for a PG community
  async getPgCommunityServices(
    pgId: string, 
    userId: string, 
    userRole: UserRole,
    filters: FilterOptions,
    pagination: PaginationOptions
  ) {
    // Verify access
    await this.verifyPgAccess(pgId, userId, userRole);

    // Build where clause
    const where: any = { pgCommunityId: pgId };
    
    if (filters.status) where.status = filters.status;
    if (filters.priority) where.priorityLevel = filters.priority;
    if (filters.serviceType) where.serviceType = filters.serviceType;

    // Calculate pagination
    const skip = (pagination.page - 1) * pagination.limit;

    // Get total count
    const totalCount = await prisma.requestedService.count({ where });

    // Get services with pagination
    const services = await prisma.requestedService.findMany({
      where,
      include: {
        requestedBy: {
          select: { 
            id: true, 
            name: true, 
            email: true,
            profilePicture: true 
          }
        },
        assignedTechnician: {
          select: { 
            id: true, 
            name: true, 
            phoneNumber: true,
            speciality: true 
          }
        },
        pgCommunity: {
          select: { id: true, name: true }
        }
      },
      orderBy: {
        [pagination.sortBy]: pagination.sortOrder
      },
      skip,
      take: pagination.limit
    });

    // Calculate summary statistics
    const summary = await this.getServicesSummary(pgId);

    return {
      services,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / pagination.limit),
        hasNext: pagination.page * pagination.limit < totalCount,
        hasPrev: pagination.page > 1
      },
      summary
    };
  },

  // Get all events for a PG community
  async getPgCommunityEvents(
    pgId: string, 
    userId: string, 
    userRole: UserRole,
    filters: FilterOptions,
    pagination: PaginationOptions
  ) {
    // Verify access
    await this.verifyPgAccess(pgId, userId, userRole);

    // Build where clause
    const where: any = { pgCommunityId: pgId };
    
    if (filters.eventType) where.eventType = filters.eventType;
    if (filters.upcoming) {
      where.startDate = { gte: new Date() };
    }

    // Calculate pagination
    const skip = (pagination.page - 1) * pagination.limit;

    // Get total count
    const totalCount = await prisma.event.count({ where });

    // Get events with pagination
    const events = await prisma.event.findMany({
      where,
      include: {
        createdBy: {
          select: { 
            id: true, 
            name: true, 
            email: true 
          }
        },
        pgCommunity: {
          select: { id: true, name: true }
        },
        _count: {
          select: {
            attendances: true,
            feedbacks: true
          }
        },
        attendances: {
          select: {
            status: true,
            user: {
              select: { id: true, name: true }
            }
          }
        },
        feedbacks: {
          select: {
            rating: true,
            feedbackType: true
          }
        }
      },
      orderBy: {
        [pagination.sortBy]: pagination.sortOrder
      },
      skip,
      take: pagination.limit
    });

    // Calculate summary statistics
    const summary = await this.getEventsSummary(pgId);

    return {
      events,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / pagination.limit),
        hasNext: pagination.page * pagination.limit < totalCount,
        hasPrev: pagination.page > 1
      },
      summary
    };
  },

  // Get comprehensive analytics for a PG community
  async getPgCommunityAnalytics(
    pgId: string, 
    userId: string, 
    userRole: UserRole,
    timeframeDays: number = 30
  ) {
    // Verify access
    await this.verifyPgAccess(pgId, userId, userRole);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - timeframeDays);

    const [
      issuesAnalytics,
      servicesAnalytics,
      eventsAnalytics,
      residentEngagement
    ] = await Promise.all([
      this.getIssuesAnalytics(pgId, startDate),
      this.getServicesAnalytics(pgId, startDate),
      this.getEventsAnalytics(pgId, startDate),
      this.getResidentEngagement(pgId, startDate)
    ]);

    return {
      timeframe: {
        days: timeframeDays,
        startDate,
        endDate: new Date()
      },
      issues: issuesAnalytics,
      services: servicesAnalytics,
      events: eventsAnalytics,
      residentEngagement
    };
  },

  // Get event-specific analytics
  async getEventAnalytics(
    pgId: string, 
    userId: string, 
    userRole: UserRole,
    timeframeDays: number = 30
  ) {
    // Verify access
    await this.verifyPgAccess(pgId, userId, userRole);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - timeframeDays);

    const events = await prisma.event.findMany({
      where: {
        pgCommunityId: pgId,
        createdAt: { gte: startDate }
      },
      include: {
        attendances: {
          select: { status: true }
        },
        feedbacks: {
          select: { rating: true, feedbackType: true }
        },
        _count: {
          select: {
            attendances: true,
            feedbacks: true
          }
        }
      }
    });

    // Calculate analytics
    const totalEvents = events.length;
    const totalRegistrations = events.reduce((sum, event) => sum + event._count.attendances, 0);
    const totalAttendances = events.reduce((sum, event) => 
      sum + event.attendances.filter(a => a.status === 'ATTENDED').length, 0
    );
    const totalFeedbacks = events.reduce((sum, event) => sum + event._count.feedbacks, 0);

    // Calculate average ratings
    const allRatings = events.flatMap(event => event.feedbacks.map(f => f.rating));
    const averageRating = allRatings.length > 0 
      ? allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length 
      : 0;

    // Feedback trends
    const positiveRatings = allRatings.filter(rating => rating >= 4).length;
    const negativeRatings = allRatings.filter(rating => rating <= 2).length;

    // Event type distribution
    const eventTypeDistribution = events.reduce((acc, event) => {
      acc[event.eventType] = (acc[event.eventType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Attendance trends by event
    const eventDetails = events.map(event => {
      const registeredCount = event.attendances.length;
      const attendedCount = event.attendances.filter(a => a.status === 'ATTENDED').length;
      const attendanceRate = registeredCount > 0 ? (attendedCount / registeredCount) * 100 : 0;
      
      const eventRatings = event.feedbacks.map(f => f.rating);
      const eventAvgRating = eventRatings.length > 0 
        ? eventRatings.reduce((sum, rating) => sum + rating, 0) / eventRatings.length 
        : 0;

      return {
        id: event.id,
        title: event.title,
        eventType: event.eventType,
        startDate: event.startDate,
        registeredCount,
        attendedCount,
        attendanceRate: Math.round(attendanceRate),
        feedbackCount: event.feedbacks.length,
        averageRating: Math.round(eventAvgRating * 10) / 10,
        engagementScore: this.calculateEngagementScore(attendanceRate, eventAvgRating, event.feedbacks.length)
      };
    });

    return {
      summary: {
        totalEvents,
        totalRegistrations,
        totalAttendances,
        totalFeedbacks,
        averageRating: Math.round(averageRating * 10) / 10,
        attendanceRate: totalRegistrations > 0 ? Math.round((totalAttendances / totalRegistrations) * 100) : 0,
        positiveRatings,
        negativeRatings,
        feedbackRate: totalRegistrations > 0 ? Math.round((totalFeedbacks / totalRegistrations) * 100) : 0
      },
      eventTypeDistribution,
      eventDetails,
      trends: {
        positive: positiveRatings,
        negative: negativeRatings,
        neutral: allRatings.length - positiveRatings - negativeRatings
      }
    };
  },

  // Get dashboard overview
  async getDashboardOverview(
    pgId: string, 
    userId: string, 
    userRole: UserRole
  ) {
    // Verify access
    await this.verifyPgAccess(pgId, userId, userRole);

    const [
      pgCommunity,
      issuesSummary,
      servicesSummary,
      eventsSummary,
      recentActivities
    ] = await Promise.all([
      prisma.pgCommunity.findUnique({
        where: { id: pgId },
        include: {
          _count: {
            select: {
              residents: true,
              issues: true,
              services: true,
              events: true,
              technicians: true
            }
          }
        }
      }),
      this.getIssuesSummary(pgId),
      this.getServicesSummary(pgId),
      this.getEventsSummary(pgId),
      this.getRecentActivities(pgId, userId, userRole, 10)
    ]);

    if (!pgCommunity) {
      throw new AppError('PG Community not found', 404);
    }

    return {
      pgCommunity: {
        id: pgCommunity.id,
        name: pgCommunity.name,
        address: pgCommunity.address,
        pgCode: pgCommunity.pgCode,
        totalResidents: pgCommunity._count.residents,
        totalTechnicians: pgCommunity._count.technicians
      },
      quickStats: {
        totalIssues: pgCommunity._count.issues,
        totalServices: pgCommunity._count.services,
        totalEvents: pgCommunity._count.events,
        pendingIssues: issuesSummary.pending,
        pendingServices: servicesSummary.pending,
        upcomingEvents: eventsSummary.upcoming
      },
      summaries: {
        issues: issuesSummary,
        services: servicesSummary,
        events: eventsSummary
      },
      recentActivities
    };
  },

  // Get recent activities
  async getRecentActivities(
    pgId: string, 
    userId: string, 
    userRole: UserRole,
    limit: number = 20
  ) {
    // Verify access
    await this.verifyPgAccess(pgId, userId, userRole);

    const [recentIssues, recentServices, recentEvents] = await Promise.all([
      prisma.raisedIssue.findMany({
        where: { pgCommunityId: pgId },
        include: {
          raisedBy: { select: { id: true, name: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: Math.ceil(limit / 3)
      }),
      prisma.requestedService.findMany({
        where: { pgCommunityId: pgId },
        include: {
          requestedBy: { select: { id: true, name: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: Math.ceil(limit / 3)
      }),
      prisma.event.findMany({
        where: { pgCommunityId: pgId },
        include: {
          createdBy: { select: { id: true, name: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: Math.ceil(limit / 3)
      })
    ]);

    // Combine and format activities
    const activities = [
      ...recentIssues.map(issue => ({
        id: issue.id,
        type: 'ISSUE' as const,
        title: issue.title,
        description: `Issue #${issue.ticketNumber} - ${issue.status}`,
        user: issue.raisedBy,
        createdAt: issue.createdAt,
        status: issue.status,
        priority: issue.priorityLevel
      })),
      ...recentServices.map(service => ({
        id: service.id,
        type: 'SERVICE' as const,
        title: service.title,
        description: `Service #${service.ticketNumber} - ${service.status}`,
        user: service.requestedBy,
        createdAt: service.createdAt,
        status: service.status,
        priority: service.priorityLevel
      })),
      ...recentEvents.map(event => ({
        id: event.id,
        type: 'EVENT' as const,
        title: event.title,
        description: `Event scheduled for ${event.startDate.toLocaleDateString()}`,
        user: event.createdBy,
        createdAt: event.createdAt,
        eventType: event.eventType,
        startDate: event.startDate
      }))
    ];

    // Sort by creation date and limit
    return activities
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  },

  // Helper methods for analytics calculations
  async getIssuesSummary(pgId: string) {
    const issues = await prisma.raisedIssue.findMany({
      where: { pgCommunityId: pgId },
      select: { status: true, priorityLevel: true, createdAt: true }
    });

    return {
      total: issues.length,
      pending: issues.filter(i => i.status === 'PENDING').length,
      assigned: issues.filter(i => i.status === 'ASSIGNED').length,
      inProgress: issues.filter(i => i.status === 'IN_PROGRESS').length,
      resolved: issues.filter(i => i.status === 'RESOLVED').length,
      critical: issues.filter(i => i.priorityLevel === 'P1').length,
      high: issues.filter(i => i.priorityLevel === 'P2').length,
      medium: issues.filter(i => i.priorityLevel === 'P3').length,
      low: issues.filter(i => i.priorityLevel === 'P4').length
    };
  },

  async getServicesSummary(pgId: string) {
    const services = await prisma.requestedService.findMany({
      where: { pgCommunityId: pgId },
      select: { status: true, priorityLevel: true, createdAt: true }
    });

    return {
      total: services.length,
      pending: services.filter(s => s.status === 'PENDING').length,
      awaitingApproval: services.filter(s => s.status === 'AWAITING_APPROVAL').length,
      approved: services.filter(s => s.status === 'APPROVED').length,
      assigned: services.filter(s => s.status === 'ASSIGNED').length,
      inProgress: services.filter(s => s.status === 'IN_PROGRESS').length,
      completed: services.filter(s => s.status === 'COMPLETED').length,
      rejected: services.filter(s => s.status === 'REJECTED').length
    };
  },

  async getEventsSummary(pgId: string) {
    const now = new Date();
    const events = await prisma.event.findMany({
      where: { pgCommunityId: pgId },
      select: { 
        eventType: true, 
        startDate: true, 
        endDate: true,
        createdAt: true,
        _count: {
          select: {
            attendances: true,
            feedbacks: true
          }
        }
      }
    });

    return {
      total: events.length,
      upcoming: events.filter(e => e.startDate > now).length,
      ongoing: events.filter(e => e.startDate <= now && e.endDate >= now).length,
      completed: events.filter(e => e.endDate < now).length,
      totalAttendances: events.reduce((sum, e) => sum + e._count.attendances, 0),
      totalFeedbacks: events.reduce((sum, e) => sum + e._count.feedbacks, 0)
    };
  },

  async getIssuesAnalytics(pgId: string, startDate: Date) {
    const issues = await prisma.raisedIssue.findMany({
      where: {
        pgCommunityId: pgId,
        createdAt: { gte: startDate }
      },
      select: {
        status: true,
        priorityLevel: true,
        issueType: true,
        createdAt: true,
        resolvedAt: true
      }
    });

    const totalIssues = issues.length;
    const resolvedIssues = issues.filter(i => i.status === 'RESOLVED').length;
    const averageResolutionTime = this.calculateAverageResolutionTime(
      issues.filter(i => i.resolvedAt)
    );

    return {
      totalIssues,
      resolvedIssues,
      resolutionRate: totalIssues > 0 ? Math.round((resolvedIssues / totalIssues) * 100) : 0,
      averageResolutionTime,
      typeDistribution: this.getDistribution(issues, 'issueType'),
      priorityDistribution: this.getDistribution(issues, 'priorityLevel'),
      statusDistribution: this.getDistribution(issues, 'status')
    };
  },

  async getServicesAnalytics(pgId: string, startDate: Date) {
    const services = await prisma.requestedService.findMany({
      where: {
        pgCommunityId: pgId,
        createdAt: { gte: startDate }
      },
      select: {
        status: true,
        priorityLevel: true,
        serviceType: true,
        createdAt: true,
        completedAt: true,
        isApprovedByOwner: true
      }
    });

    const totalServices = services.length;
    const completedServices = services.filter(s => s.status === 'COMPLETED').length;
    const approvedServices = services.filter(s => s.isApprovedByOwner).length;

    return {
      totalServices,
      completedServices,
      approvedServices,
      completionRate: totalServices > 0 ? Math.round((completedServices / totalServices) * 100) : 0,
      approvalRate: totalServices > 0 ? Math.round((approvedServices / totalServices) * 100) : 0,
      typeDistribution: this.getDistribution(services, 'serviceType'),
      priorityDistribution: this.getDistribution(services, 'priorityLevel'),
      statusDistribution: this.getDistribution(services, 'status')
    };
  },

  async getEventsAnalytics(pgId: string, startDate: Date) {
    const events = await prisma.event.findMany({
      where: {
        pgCommunityId: pgId,
        createdAt: { gte: startDate }
      },
      include: {
        attendances: {
          select: { status: true }
        },
        feedbacks: {
          select: { rating: true }
        }
      }
    });

    const totalEvents = events.length;
    const totalRegistrations = events.reduce((sum, e) => sum + e.attendances.length, 0);
    const totalAttendances = events.reduce((sum, e) => 
      sum + e.attendances.filter(a => a.status === 'ATTENDED').length, 0
    );

    const allRatings = events.flatMap(e => e.feedbacks.map(f => f.rating));
    const averageRating = allRatings.length > 0 
      ? allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length 
      : 0;

    return {
      totalEvents,
      totalRegistrations,
      totalAttendances,
      attendanceRate: totalRegistrations > 0 ? Math.round((totalAttendances / totalRegistrations) * 100) : 0,
      averageRating: Math.round(averageRating * 10) / 10,
      typeDistribution: this.getDistribution(events, 'eventType'),
      engagementTrends: this.calculateEngagementTrends(events)
    };
  },

  async getResidentEngagement(pgId: string, startDate: Date) {
    const [issueParticipation, serviceParticipation, eventParticipation] = await Promise.all([
      prisma.raisedIssue.groupBy({
        by: ['raisedById'],
        where: {
          pgCommunityId: pgId,
          createdAt: { gte: startDate }
        },
        _count: { id: true }
      }),
      prisma.requestedService.groupBy({
        by: ['requestedById'],
        where: {
          pgCommunityId: pgId,
          createdAt: { gte: startDate }
        },
        _count: { id: true }
      }),
      prisma.eventAttendance.groupBy({
        by: ['userId'],
        where: {
          event: {
            pgCommunityId: pgId,
            createdAt: { gte: startDate }
          }
        },
        _count: { id: true }
      })
    ]);

    const activeResidents = new Set([
      ...issueParticipation.map(p => p.raisedById),
      ...serviceParticipation.map(p => p.requestedById),
      ...eventParticipation.map(p => p.userId)
    ]).size;

    return {
      activeResidents,
      issueReporters: issueParticipation.length,
      serviceRequesters: serviceParticipation.length,
      eventParticipants: eventParticipation.length,
      averageIssuesPerResident: issueParticipation.length > 0 
        ? Math.round(issueParticipation.reduce((sum, p) => sum + p._count.id, 0) / issueParticipation.length * 10) / 10
        : 0,
      averageServicesPerResident: serviceParticipation.length > 0
        ? Math.round(serviceParticipation.reduce((sum, p) => sum + p._count.id, 0) / serviceParticipation.length * 10) / 10
        : 0,
      averageEventAttendancePerResident: eventParticipation.length > 0
        ? Math.round(eventParticipation.reduce((sum, p) => sum + p._count.id, 0) / eventParticipation.length * 10) / 10
        : 0
    };
  },

  // Utility methods
  getDistribution(items: any[], field: string): Record<string, number> {
    return items.reduce((acc, item) => {
      const value = item[field];
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  },

  calculateAverageResolutionTime(resolvedIssues: any[]): number {
    if (resolvedIssues.length === 0) return 0;
    
    const totalHours = resolvedIssues.reduce((sum, issue) => {
      const createdAt = new Date(issue.createdAt);
      const resolvedAt = new Date(issue.resolvedAt);
      const diffHours = (resolvedAt.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
      return sum + diffHours;
    }, 0);

    return Math.round(totalHours / resolvedIssues.length);
  },

  calculateEngagementScore(attendanceRate: number, averageRating: number, feedbackCount: number): number {
    // Weighted engagement score (0-100)
    const attendanceWeight = 0.4;
    const ratingWeight = 0.4;
    const feedbackWeight = 0.2;

    const attendanceScore = attendanceRate;
    const ratingScore = (averageRating / 5) * 100;
    const feedbackScore = Math.min(feedbackCount * 10, 100); // Cap at 100

    return Math.round(
      (attendanceScore * attendanceWeight) +
      (ratingScore * ratingWeight) +
      (feedbackScore * feedbackWeight)
    );
  },

  calculateEngagementTrends(events: any[]): any {
    const trends = events.map(event => {
      const registrations = event.attendances.length;
      const attendances = event.attendances.filter((a: any) => a.status === 'ATTENDED').length;
      const attendanceRate = registrations > 0 ? (attendances / registrations) * 100 : 0;
      
      const ratings = event.feedbacks.map((f: any) => f.rating);
      const avgRating = ratings.length > 0 ? ratings.reduce((sum: number, r: number) => sum + r, 0) / ratings.length : 0;
      
      return {
        date: event.startDate,
        attendanceRate: Math.round(attendanceRate),
        averageRating: Math.round(avgRating * 10) / 10,
        engagementScore: this.calculateEngagementScore(attendanceRate, avgRating, ratings.length)
      };
    });

    return trends.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }
};