import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

// Create PG Community validation schema
export const createPgCommunitySchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, 'PG name must be at least 2 characters long')
      .max(100, 'PG name cannot exceed 100 characters')
      .trim(),
    address: z
      .string()
      .min(5, 'Address must be at least 5 characters long')
      .max(500, 'Address cannot exceed 500 characters')
      .trim(),
    description: z
      .string()
      .max(1000, 'Description cannot exceed 1000 characters')
      .trim()
      .optional()
      .or(z.literal(''))
  })
});

// Update PG Community validation schema
export const updatePgCommunitySchema = z.object({
  params: z.object({
    id: z.string().min(1, 'PG Community ID is required')
  }),
  body: z.object({
    name: z
      .string()
      .min(2, 'PG name must be at least 2 characters long')
      .max(100, 'PG name cannot exceed 100 characters')
      .trim()
      .optional(),
    address: z
      .string()
      .min(5, 'Address must be at least 5 characters long')
      .max(500, 'Address cannot exceed 500 characters')
      .trim()
      .optional(),
    description: z
      .string()
      .max(1000, 'Description cannot exceed 1000 characters')
      .trim()
      .optional()
      .or(z.literal(''))
  }).refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "At least one field (name, address, or description) must be provided for update"
    }
  )
});

// Get PG Community by ID validation schema
export const getPgCommunityByIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'PG Community ID is required')
  })
});

// Get PG Community by code validation schema
export const getPgCommunityByCodeSchema = z.object({
  params: z.object({
    pgCode: z
      .string()
      .min(1, 'PG Code is required')
      .max(10, 'PG Code cannot exceed 10 characters')
      .regex(/^[A-Z0-9]+$/, 'PG Code must contain only uppercase letters and numbers')
  })
});

// Search PG Communities validation schema
export const searchPgCommunitiesSchema = z.object({
  query: z.object({
    q: z
      .string()
      .min(1, 'Search query is required')
      .max(100, 'Search query cannot exceed 100 characters')
      .trim(),
    limit: z
      .string()
      .regex(/^\d+$/, 'Limit must be a number')
      .transform(Number)
      .refine((val) => val >= 1 && val <= 50, 'Limit must be between 1 and 50')
      .optional()
  })
});

// Get residents validation schema (uses same ID validation)
export const getPgCommunityResidentsSchema = getPgCommunityByIdSchema;

// Get PG Community stats validation schema (uses same ID validation)
export const getPgCommunityStatsSchema = getPgCommunityByIdSchema;

// Validation middleware
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
        const errorMessages = error.errors.map((issue) => ({
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

// Custom validation functions
export const validatePgCode = (pgCode: string): boolean => {
  const pgCodeRegex = /^[A-Z0-9]{6}$/;
  return pgCodeRegex.test(pgCode);
};

export const validatePgCommunityName = (name: string): boolean => {
  // Check for inappropriate content or excessive special characters
  const inappropriatePattern = /[<>{}|\\^`]/;
  return !inappropriatePattern.test(name) && name.trim().length >= 2;
};

export const sanitizePgCommunityData = (data: any) => {
  return {
    ...data,
    name: data.name?.trim(),
    address: data.address?.trim(),
    description: data.description?.trim() || null,
  };
};

// Validation for bulk operations (if needed in future)
export const bulkUpdatePgCommunitiesSchema = z.object({
  body: z.object({
    communities: z.array(
      z.object({
        id: z.string().min(1, 'PG Community ID is required'),
        name: z.string().min(2).max(100).trim().optional(),
        address: z.string().min(5).max(500).trim().optional(),
        description: z.string().max(1000).trim().optional(),
      })
    ).min(1, 'At least one community must be provided').max(10, 'Cannot update more than 10 communities at once')
  })
});

// Export types for TypeScript
export type CreatePgCommunityInput = z.infer<typeof createPgCommunitySchema>['body'];
export type UpdatePgCommunityInput = z.infer<typeof updatePgCommunitySchema>['body'];
export type SearchPgCommunitiesQuery = z.infer<typeof searchPgCommunitiesSchema>['query'];