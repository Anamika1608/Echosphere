import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

// Validation schemas for analytics endpoints
export const getPgAnalyticsSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'PG Community ID is required')
  }),
  query: z.object({
    timeframe: z.string().regex(/^\d+$/).optional().default('30'),
  }).optional()
});

export const getPgIssuesSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'PG Community ID is required')
  }),
  query: z.object({
    page: z.string().regex(/^\d+$/).optional().default('1'),
    limit: z.string().regex(/^\d+$/).optional().default('10'),
    status: z.enum(['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED']).optional(),
    priority: z.enum(['P1', 'P2', 'P3', 'P4']).optional(),
    issueType: z.enum([
      'PLUMBING', 'ELECTRICAL', 'HEATING_COOLING', 'CLEANING', 
      'SECURITY', 'INTERNET_WIFI', 'APPLIANCE', 'STRUCTURAL', 
      'PEST_CONTROL', 'OTHER'
    ]).optional(),
    sortBy: z.enum(['createdAt', 'updatedAt', 'priorityLevel', 'status']).optional().default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc')
  }).optional()
});

export const getPgServicesSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'PG Community ID is required')
  }),
  query: z.object({
    page: z.string().regex(/^\d+$/).optional().default('1'),
    limit: z.string().regex(/^\d+$/).optional().default('10'),
    status: z.enum([
      'PENDING', 'AWAITING_APPROVAL', 'APPROVED', 
      'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED'
    ]).optional(),
    priority: z.enum(['P1', 'P2', 'P3', 'P4']).optional(),
    serviceType: z.enum([
      'CLEANING', 'MAINTENANCE', 'REPAIR', 'INSTALLATION', 
      'UPGRADE', 'INSPECTION', 'OTHER'
    ]).optional(),
    sortBy: z.enum(['createdAt', 'updatedAt', 'priorityLevel', 'status']).optional().default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc')
  }).optional()
});

export const getPgEventsSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'PG Community ID is required')
  }),
  query: z.object({
    page: z.string().regex(/^\d+$/).optional().default('1'),
    limit: z.string().regex(/^\d+$/).optional().default('10'),
    eventType: z.enum([
      'SOCIAL', 'MAINTENANCE', 'MEETING', 'CELEBRATION', 
      'WORKSHOP', 'ANNOUNCEMENT', 'OTHER'
    ]).optional(),
    upcoming: z.enum(['true', 'false']).optional().default('false'),
    sortBy: z.enum(['createdAt', 'startDate', 'endDate', 'eventType']).optional().default('startDate'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc')
  }).optional()
});

export const getRecentActivitiesSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'PG Community ID is required')
  }),
  query: z.object({
    limit: z.string().regex(/^\d+$/).optional().default('20')
  }).optional()
});

// User-specific validation schemas (without params.id requirement)
export const getUserIssuesSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional().default('1'),
    limit: z.string().regex(/^\d+$/).optional().default('10'),
    status: z.enum(['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED']).optional(),
    priority: z.enum(['P1', 'P2', 'P3', 'P4']).optional(),
    issueType: z.enum([
      'PLUMBING', 'ELECTRICAL', 'HEATING_COOLING', 'CLEANING', 
      'SECURITY', 'INTERNET_WIFI', 'APPLIANCE', 'STRUCTURAL', 
      'PEST_CONTROL', 'OTHER'
    ]).optional(),
    sortBy: z.enum(['createdAt', 'updatedAt', 'priorityLevel', 'status']).optional().default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc')
  }).optional()
});

export const getUserServicesSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional().default('1'),
    limit: z.string().regex(/^\d+$/).optional().default('10'),
    status: z.enum([
      'PENDING', 'AWAITING_APPROVAL', 'APPROVED', 
      'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED'
    ]).optional(),
    priority: z.enum(['P1', 'P2', 'P3', 'P4']).optional(),
    serviceType: z.enum([
      'CLEANING', 'MAINTENANCE', 'REPAIR', 'INSTALLATION', 
      'UPGRADE', 'INSPECTION', 'OTHER'
    ]).optional(),
    sortBy: z.enum(['createdAt', 'updatedAt', 'priorityLevel', 'status']).optional().default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc')
  }).optional()
});

export const getUserEventsSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional().default('1'),
    limit: z.string().regex(/^\d+$/).optional().default('10'),
    eventType: z.enum([
      'SOCIAL', 'MAINTENANCE', 'MEETING', 'CELEBRATION', 
      'WORKSHOP', 'ANNOUNCEMENT', 'OTHER'
    ]).optional(),
    upcoming: z.enum(['true', 'false']).optional().default('false'),
    sortBy: z.enum(['createdAt', 'startDate', 'endDate', 'eventType']).optional().default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc')
  }).optional()
});

export const getUserActivitiesSchema = z.object({
  query: z.object({
    limit: z.string().regex(/^\d+$/).optional().default('20')
  }).optional()
});


// Generic validation middleware
export const validate = (schema: z.ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));
        
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errorMessages,
        });
      }
      next(error);
    }
  };
};

// Export all validation schemas
export const analyticsValidationSchemas = {
  // PG Community specific schemas
  getPgAnalyticsSchema,
  getPgIssuesSchema,
  getPgServicesSchema,
  getPgEventsSchema,
  getRecentActivitiesSchema,
  
  // User specific schemas
  getUserIssuesSchema,
  getUserServicesSchema,
  getUserEventsSchema,
  getUserActivitiesSchema,
};